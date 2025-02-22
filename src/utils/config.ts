import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Environment type
 */
export type Environment = 'uat' | 'development' | 'production' | 'local';

/**
 * Config object
 */
export interface Config {
    appName: string;
    env: Environment;
    telegramBotToken: string;
    debug: boolean;
    openaiApiKey: string;
    googleBooksApiKey: string;
    mysql: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    };
}

/**
 * Partial config object to allow loading in parts
 */
const config: Partial<Config> = {}; // Partial<Config> is used to allow the config to be loaded in parts

/**
 * Check if an object is a valid config object
 * @param config Unknown object to check if it is a valid config object
 * @returns True if the object is a valid config object, false otherwise
 */
function isConfigValid(config: Partial<Config>): config is Config {
    return !!config.appName && !!config.env && !!config.telegramBotToken && !!config.openaiApiKey;
}

/**
 * Load the config from environment variables.  
 * If the config is already loaded, this function does nothing.  
 * After loading the config, it is frozen to prevent further modifications.
 */
function loadConfig(): void {
    if (Object.isFrozen(config)) {
        return;
    }
    const tempConfig: Partial<Config> = {};
    tempConfig.appName = process.env.APP_NAME;
    tempConfig.env = process.env.NODE_ENV as Environment;
    tempConfig.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    tempConfig.debug = process.env.APP_DEBUG === 'true';
    tempConfig.openaiApiKey = process.env.OPENAI_API_KEY;
    tempConfig.googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
    tempConfig.mysql = {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    };
    if (!isConfigValid(tempConfig)) {
        throw new Error('Invalid config');
    }
    Object.assign(config, tempConfig); // Copy the properties from tempConfig to config
    Object.freeze(config); // Prevent further modifications
}

/**
 * Get the config object.  
 * This function should be used to get the entire config object excluding custom keys.  
 * If you need a specific value from the config object or custom keys, use `getConfigValue` instead.  
 * @returns Readonly config object
 */
export function getConfig(): Readonly<Config> {
    if (!isConfigValid(config)) {
        new Error('Invalid config')
    }
    return config as Config;
}

/**
 * Get a specific value from the config object.  
 * If the value is not found in the config object, it is searched in the environment variables.  
 * Use this function to get a specific value from the config object or environment variables.
 * @param key Key of the config value to get
 * @returns Config value
 */
export function getConfigValue<T extends keyof Config | string>(key: T): T extends keyof Config ? Config[T] : string {
    const config = getConfig();
    if (key in config) {
        return config[key as keyof Config] as T extends keyof Config ? Config[T] : string;
    }

    // Find in environment variables
    const envValue = process.env[key];
    if (!envValue) {
        throw new Error(`Config value not found for key: ${key}`);
    }
    return envValue as T extends keyof Config ? Config[T] : string;
}


/**
 * Get the current environment
 * @returns Current environment
 */
export function getEnvironment(): Environment {
    return getConfigValue('env');
}

/**
 * Check if the current environment is development
 * @returns True if the current environment is development, false otherwise
 */
export function isDevelopment(): boolean {
    return getEnvironment() === 'development';
}

/**
 * Check if the current environment is production
 * @returns True if the current environment is production, false otherwise
 */
export function isProduction(): boolean {
    return getEnvironment() === 'production';
}

/**
 * Check if the current environment is UAT
 * @returns True if the current environment is UAT, false otherwise
 */
export function isUAT(): boolean {
    return getEnvironment() === 'uat';
}

/**
 * Check if the current environment is local
 * @returns True if the current environment is local, false otherwise
 */
export function isLocal(): boolean {
    return getEnvironment() === 'local';
}

// Load the config when the module is loaded
loadConfig();