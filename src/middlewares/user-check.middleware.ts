import { User } from "@/entities/user";
import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";


/**
 * Middleware to check if user is authorized to use the bot
 * @param bot Bot instance
 */
export function checkUserMiddleware(bot: Telegraf) {
    bot.use(async (ctx, next) => {
        if (!ctx.message || !ctx.message.from) {
            return;
        }

        // check if user issued a start command
        if ('text' in ctx.message && ctx.message.text.trim() === "/start") {
            await next();
            return;
        }

        const user = await User.findOne({ where: { telegramId: ctx.message.from.id } });
        if (!user) {
            ctx.reply("You are not authorized to use this bot. Please contact the admin.");
            return;
        }

        // check if last interaction is more than 1 hour, if so, update last interaction
        const lastInteraction = user.lastInteraction;
        if (lastInteraction) {
            const diff = new Date().getTime() - lastInteraction.getTime();
            if (diff > 3600000) {
                user.lastInteraction = new Date();
                await user.save();
            }
        }

        await next();
    });


    debug("Middleware defined: checkUser");
}



