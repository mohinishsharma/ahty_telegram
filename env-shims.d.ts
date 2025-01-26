// Purpose: Define the types for the environment variables.

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The name of the application.
     */
    APP_NAME: string;
    /**
     * The environment the application is running in.
     */
    NODE_ENV: string;
    /**
     * Telegram bot token
     */
    TELEGRAM_BOT_TOKEN: string;
    /**
     * Debug mode  
     * true: Debug mode is enabled
     */
    APP_DEBUG: string;
    /**
     * OpenAI API key
     */
    OPENAI_API_KEY: string;
    /**
     * Google Books API key
     */
    GOOGLE_BOOKS_API_KEY: string;
  }
}
