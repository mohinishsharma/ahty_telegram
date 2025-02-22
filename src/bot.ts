import { Telegraf } from "telegraf";

export type TelegramBotListener = (bot: Telegraf) => void;

export interface TelegramBotOptions {
    /**
     * List of listeners to add to the bot
     */
    listeners?: TelegramBotListener[];
}

/**
 * Telegram bot class   
 * which wraps the Telegraf bot for easier use
 */
export class TelegramBot {
    /**
     * The Telegraf bot instance
     */
    private bot: Telegraf;

    /**
     * Options for the Telegram bot
     */
    private options: TelegramBotOptions;

    /**
     * Creates an instance of TelegramBot.
     * @param token - The bot token from BotFather
     * @param options - Configuration options for the bot
     */
    constructor(token: string, options: TelegramBotOptions = {}) {
        this.bot = new Telegraf(token);
        this.options = options;
        this.init();
    }

    /**
     * Initializes the bot with the provided listeners
     */
    private init() {
        if (this.options.listeners) {
            this.options.listeners.forEach(listener => {
                this.addListener(listener);
            });
        }
    }

    /**
     * Adds a listener to the bot
     * @param listener - The listener function to add
     */
    addListener(listener: TelegramBotListener) {
        listener(this.bot);
    }

    /**
     * Starts the bot
     */
    start() {
        this.bot.launch();
    }

    /**
     * Stops the bot
     */
    stop() {
        this.bot.stop();
    }
}