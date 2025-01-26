import consola, { LogLevels } from "consola";
import { getConfigValue } from "@/utils/config";


/**
 * Log a debug message
 * @param message Message to log
*/
export function debug(message: unknown, ...obj: unknown[]): void {
    const isDebug = getConfigValue("debug");
    if (isDebug) {
        consola.level = LogLevels.debug;
        consola.debug(message);
        if (obj.length > 0) {
            for (const o of obj) {
                consola.debug(o);
            }
        }
    }
}