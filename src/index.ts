import "reflect-metadata";
import consola from "consola";
import pc from "picocolors";
import { getConfigValue } from "@/utils/config";
import { TelegramBot } from "@/bot";
import { registerListeners } from "@/listeners/index";
import dataSource from "./typeorm";

/**
 * Main application function  
 * which starts the bot and registers all listeners
 */
async function application() {
    const appName = getConfigValue("appName");
    const env = getConfigValue("env");
    const token = getConfigValue("telegramBotToken");

    consola.info(`Starting ${appName} in ${pc.bgGreenBright(env)} mode`);
    
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
    consola.info(`Database connection: ${dataSource.isInitialized ? pc.green("Connected") : pc.red("Failed")}`);
    const bot = new TelegramBot(token);
    registerListeners(bot); // Register all listeners
    bot.start();
    consola.success(`${appName} started`);

    // Handle SIGINT signal
    process.on("SIGINT", () => {
        consola.info(`Stopping ${appName}`);
        bot.stop();
        process.exit();
    });
}

application(); // Start the application






