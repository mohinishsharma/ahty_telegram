import { Telegraf } from "telegraf";

export type TelegramBotListener = (bot: Telegraf) => void;

export interface TelegramBotOptions {
    /**
     * List of listeners to add to the bot
     */
    listeners?: TelegramBotListener[];
}

export class TelegramBot {
    private bot: Telegraf;

    private options: TelegramBotOptions;

    constructor(token: string, options: TelegramBotOptions = {}) {
        this.bot = new Telegraf(token);
        this.options = options;
        this.init();
    }

    private init() {
        if (this.options.listeners) {
            this.options.listeners.forEach(listener => {
                this.addListener(listener);
            });
        }
    }

    addListener(listener: TelegramBotListener) {
        listener(this.bot);
    }

    start() {
        this.bot.launch();
    }

    stop() {
        this.bot.stop();
    }
}