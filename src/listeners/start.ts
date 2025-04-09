import { debug } from "@/utils/debug";
import { Telegraf } from "telegraf";
import { User } from "@/entities/user";
import { getConfigValue } from "@/utils/config";

/**
 * Application name
 */
const appName = getConfigValue("appName");

/**
 * Start command listener for the bot
 * @param bot Bot instance
 */
export function startListener(bot: Telegraf) {
    bot.command("start", async (ctx) => {

        // first check if message is from a private chat
        if (!ctx.msg.chat || !ctx.msg.chat.type || ctx.msg.chat.type !== "private") {
            ctx.reply("Please start the bot in a private chat.");
            return;
        }

        const user = await User.findOne({ where: { telegramId: ctx.msg.from.id } });
        if (user) {
            ctx.reply(`Hello, ${user.firstName}!\nWelcome back to the ${appName}!`);
        } else {
            const newUser = User.create({
                telegramId: ctx.msg.from.id,
                username: ctx.msg.from.username || ctx.msg.from.id.toString(),
                firstName: ctx.msg.from.first_name,
                lastName: ctx.msg.from.last_name
            });
            await newUser.save();
            ctx.reply(`Welcome to the ${appName}!`);
        }

    });
    debug("Listener defined: /start");
}