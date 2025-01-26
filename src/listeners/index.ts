import { TelegramBot } from "@/bot";
import { defineListener } from "@/listeners/define";
import { solveListener } from "./solve";
import { bookListener } from "./book";
import { quizListener } from "./quiz";


/**
 * Register all listeners to the bot.  
 * If you have more listeners, add them here.  
 * @param telegramBot Current Telegram bot instance
 */
export function registerListeners(telegramBot: TelegramBot) {
    telegramBot.addListener(defineListener);
    telegramBot.addListener(solveListener);
    telegramBot.addListener(bookListener);
    telegramBot.addListener(quizListener);
}

