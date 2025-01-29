import { solveGREQuestion } from "@/services/openai";
import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";

/**
 * Solve listener for the bot
 * @param bot Bot instance
 */
export function solveListener(bot: Telegraf) {
    bot.command("solve", async (ctx) => {
        // check if message is reply
        const message = ctx.message;
        if (!message) {
            return;
        }
        const replyToMessage = message.reply_to_message;
        if (!replyToMessage) {
            return;
        }
        ctx.deleteMessage().catch(() => {});
        ctx.sendChatAction("typing");
        // @ts-expect-error text is not defined in type
        const text = replyToMessage.text;
        if (!text) {
            ctx.reply("Please reply to a GRE question to solve it.");
            return;
        }
        const response = await solveGREQuestion(text);
        ctx.reply(response, { parse_mode: "HTML", reply_parameters: { message_id: replyToMessage.message_id, chat_id: replyToMessage.chat.id } });

    });
    debug("Listener defined: /solve");
}