import consola from "consola";
import pc from "picocolors";
import { getConfigValue } from "@/utils/config";
import { TelegramBot } from "@/bot";
import { registerListeners } from "@/listeners/index";


function application() {
    // Your application code
    const appName = getConfigValue("appName");
    const env = getConfigValue("env");
    const token = getConfigValue("telegramBotToken");

    consola.info(`Starting ${appName} in ${pc.bgGreenBright(env)} mode`);

    const bot = new TelegramBot(token);
    registerListeners(bot); // Register all listeners
    bot.start();
    consola.success(`${appName} started`);

    process.on("SIGINT", () => {
        consola.info(`Stopping ${appName}`);
        bot.stop();
        process.exit();
    });
}

application();






