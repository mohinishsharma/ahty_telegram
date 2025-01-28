import { getGREQuiz } from "@/services/openai";
import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";

/**
 * Quiz listener for the bot
 * @param bot Bot instance
 */
export function quizListener(bot: Telegraf) {
    bot.command("quiz", async (ctx) => {
        const [, ...rest] = ctx.message.text.split(" ");
        const args = rest.join(" ");
        
        // reply with typing
        ctx.deleteMessage();
        ctx.sendChatAction("typing");
        const response = await getGREQuiz(args);
        if (!response) {
            return;
        }
        const questionId = Math.abs(ctx.message.message_id);
        const message = `#Q${questionId}\n[${response.difficulty}]\n\n${response.question}`;
        
        const questionMessage = await ctx.reply(message, { parse_mode: "HTML" });
        // reply with the quiz question
        await ctx.replyWithQuiz(`#Q${questionId}`, response.choices, { correct_option_id: response.answer_index, reply_parameters: { message_id: questionMessage.message_id }, is_anonymous: false });
        // reply with the explanation in spoiler
        await ctx.reply(`#Q${questionId} Explanation\n\n<span class="tg-spoiler">${response.explanation}</span>`, { parse_mode: "HTML" });

    });
    debug("Listener defined: /quiz");
}