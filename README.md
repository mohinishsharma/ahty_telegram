# AHTY Telegram Bot

AHTY Telegram Bot is a TypeScript-based bot that integrates with OpenAI, Google Books, LibGen, and Dictionary APIs to provide various functionalities such as defining words, solving GRE questions, searching for books, and more.

## Features

- Define words and phrases using OpenAI.
- Solve GRE questions with detailed explanations.
- Generate GRE quiz questions.
- Search for books using Google Books API.
- Search for books using LibGen.
- Get word definitions using Dictionary API.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/ahty_telegram_ts.git
    cd ahty_telegram_ts
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your API keys:

    ```env
    openaiApiKey=your_openai_api_key
    googleBooksApiKey=your_google_books_api_key
    dictionaryApiKey=your_dictionary_api_key
    ```

## Usage

### Development

To start the development server:

```sh
npm run dev
```

### Build

To build the project:

```sh
npm run build
```

### Lint

To lint the code:

```sh
npm run lint
```

To fix linting errors:

```sh
npm run lint:fix
```

### Type Checking

To check types:

```sh
npm run check-types
```

## API Endpoints

### OpenAI Service

- **defineWord(prompt: string): Promise<string>**
  - Get the definition of a word or phrase.

- **solveGREQuestion(prompt: string): Promise<string>**
  - Solve a GRE question and provide an explanation.

- **getGREQuiz(): Promise<Question | null>**
  - Generate a GRE quiz question.

### Google Books Service

- **searchGoogleBooks(query: string): Promise<Volume[]>**
  - Search for books based on a query.

### LibGen Service

- **searchLibGen(query: string): Promise<Book[]>**
  - Search for books on LibGen.

### Dictionary Service

- **getWordDefinition(word: string): Promise<Definition>**
  - Get the definition of a word.

## License

This project is licensed under the GNU General Public License Version 3.

## Author

Mohinish Sharma - [sharmamohinish67@gmail.com](mailto:sharmamohinish67@gmail.com)
