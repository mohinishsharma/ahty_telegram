import { defineWord } from "@/services/dictionary";
import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";

/**
 * Define listener for the bot
 * @param bot Bot instance
 */
export function defineListener(bot: Telegraf) {
    bot.command("define", async (ctx) => {
        const text = ctx.message?.text;
        if (!text) {
            return;
        }
        const word = text.split(" ")[1];
        if (!word) {
            return;
        }
        ctx.deleteMessage();
        // reply with typing
        ctx.sendChatAction("typing");
        const response = await defineWord(word);
        ctx.reply(response, { parse_mode: "Markdown" });
    });
    debug("Listener defined: /define");
}