import { solveGREQuestion } from "@/services/openai";
import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";
import { PhotoSize } from "telegraf/types";
import { Blob } from "node:buffer";
import mime from "mime-types";

/**
 * Solve listener for the bot
 * @param bot Bot instance
 */
export function solveListener(bot: Telegraf) {
    bot.command("solve", async (ctx) => {
        // check if message is reply
        const messagea = ctx.message;
        if (!messagea) {
            return;
        }
        const replyToMessage = messagea.reply_to_message;
        if (!replyToMessage) {
            return;
        }
        ctx.deleteMessage().catch(() => {});
        ctx.sendChatAction("typing");
        // @ts-expect-error text is not defined in type
        const text = replyToMessage.text || replyToMessage.caption;
        let image: Blob | undefined; // Image of the question (if any)
        // @ts-expect-error photo is not defined in type
        const photos = (replyToMessage.photo || []) as PhotoSize[];
        const photo = photos[Math.min(2, photos.length - 1)];
        if (photo) {
            const photoFile = await ctx.telegram.getFile(photo.file_id);
            const photoURL = await ctx.telegram.getFileLink(photoFile);
            image = await fetch(photoURL.href).then((res) => res.blob());
            if (image) {
                image = new Blob([image], { type: mime.lookup(photoURL.href) || "image/jpeg" });
            }
        }

        if (!text) {
            ctx.reply("Please reply to a GRE question to solve it.");
            return;
        }
        const response = await solveGREQuestion(text, image);
        ctx.reply(response, { parse_mode: "HTML", reply_parameters: { message_id: replyToMessage.message_id, chat_id: replyToMessage.chat.id } });

    });
    debug("Listener defined: /solve");
}