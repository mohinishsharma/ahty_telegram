import { TelegramBot } from "@/bot";
import { checkUserMiddleware } from "./user-check.middleware";


/**
 * Register global all middlewares to the bot.  
 * If you have more middleware, add them here.  
 * Note: The order of middlewares is important.
 * @param telegramBot Current Telegram bot instance
 */
export function registerMiddlewares(telegramBot: TelegramBot) {
    telegramBot.addMiddleware(checkUserMiddleware);
}

