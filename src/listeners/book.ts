import { Telegraf } from "telegraf";
import { downloadBook, searchLibgenBooks } from "@/services/libgen";
import { InlineKeyboardButton } from "telegraf/types";
import { debug } from "@/utils/debug";
import { searchGoogleBooks } from "@/services/google-books";


export async function bookListener(bot: Telegraf) {

    
    bot.command("book", async (ctx) => {
        const text = ctx.message?.text;
        if (!text) {
            return;
        }
        const query = text.split(" ").slice(1).join(" ");
        if (!query) {
            return;
        }
        ctx.deleteMessage().catch(() => {});
        // reply with typing
        ctx.sendChatAction("typing");
        // const processingMessage = await ctx.reply("Searching for books...", { reply_markup: { remove_keyboard: true } });
        // search for books in google books
        const googleBooks = await searchGoogleBooks(query);
        const allTitles = googleBooks.map((book) => book.volumeInfo.title);
        // search for books in libgen
        // Note: This is a sequential search. It can not be parallelized because libgen blocks requests from the same IP if they are too frequent.
        const libgenBooks = [];
        for (const title of allTitles) {
            const books = await searchLibgenBooks(title);
            libgenBooks.push(books[0]);
        }

        const ikbd: InlineKeyboardButton[] = [];
        let idx = 1;
        const message = libgenBooks.reduce((acc, book, i) => {
            if (!book) {
                return acc;
            }
            const gBook = googleBooks[i];
            ikbd.push({ text: (idx).toString(), callback_data: `dwn ${book.md5}` });
            acc += `${idx}. *${gBook.volumeInfo.title}*\n`;
            acc += `Author: ${gBook.volumeInfo.authors?.join(", ") || "Unknown"}\n`;
            acc += `Year: ${gBook.volumeInfo.publishedDate}\n`;
            acc += `Pages: ${gBook.volumeInfo.pageCount}\n`;
            acc += `Language: ${gBook.volumeInfo.language}\n`;
            acc += `Size: ${book.size}\n`;
            acc += `Extension: ${book.extension}\n`;
            idx++;
            return acc;
        }, "");
        ctx.reply(message, { parse_mode: "Markdown", reply_markup: { inline_keyboard: [ikbd, [{ callback_data: 'discard', text: 'Discard' }]] } });
    });
    debug("Listener defined: /book");

    bot.on("callback_query", async (ctx) => {
        // @ts-expect-error data is not defined in type
        const data = ctx.callbackQuery?.data;
        debug("Callback query data", data);
        const [action, ...rest] = data.split(" ");
        const commandData = rest.join(" ");
        if (action === "discard") {
            ctx.deleteMessage().catch(() => {});
            return;
        } else if (action === "dwn") {
            if (!commandData) {
                return;
            }
            const book = await downloadBook(commandData);
            debug("Book downloaded", book);
            if (!book) {
                return;
            }
    
            ctx.editMessageText(`*${book.title}*\n${book.author}\nPublisher: ${book.publisher}`, { parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: "Download", url: book.url }]] } });
        } else {
            return;
        }
    });
}