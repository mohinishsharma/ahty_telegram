import axios from "axios";

const dictionaryClient = axios.create({
    baseURL: "https://api.dictionaryapi.dev/api/v2/entries/en",
});

/**
 * Get the response from Dictionary API
 * @param word Word to search in the dictionary
 * @returns Response from Dictionary API
 */
export async function defineWord(word: string): Promise<string> {
    const response = await dictionaryClient.get(`/${word}`);
    const data = response.data as WordData[];
    if (!data) {
        return "No definition found";
    }
    const def = data[0];
    const meanings = def.meanings;
    if (!meanings) {
        return "No definition found";
    }
    let message = `${def.word.charAt(0).toUpperCase() + def.word.slice(1)}\n🗣️ Phonetic: ${def.phonetic || "Not available"}\n\n`;
    const syn: string[] = [];
    const ant: string[] = [];
    meanings.forEach(meaning => {
        const partOfSpeech = meaning.partOfSpeech;
        message += `*${partOfSpeech}*\n`;
        meaning.definitions.forEach((definition, i) => {
            message += `${i + 1}. ${definition.definition}\n`;
            message += definition.example ? `*Example:* ${definition.example}\n\n` : '';
            syn.push(...definition.synonyms);
            ant.push(...definition.antonyms);
        });
        message += "\n";
    });
    if (syn.length > 0)
        message += `\n*Synonym:* ${syn.slice(0,6).join()}`;
    if (ant.length > 0)
    message += `\n*Antonym:* ${ant.slice(0,6).join()}`;
    return message;
}

export async function getPhoneticAudioBuffer(word: string): Promise<Buffer | null> {
    const response = await dictionaryClient.get(`/${word}`);
    const data = response.data as WordData[];
    if (!data) {
        return null;
    }
    const def = data[0];
    const phonetics = def.phonetics;
    if (!phonetics) {
        return null;
    }
    const phonetic = phonetics[0];
    if (!phonetic) {
        return null;
    }
    const audioUrl = phonetic.audio;
    const audioResponse = await axios.get(audioUrl, {
        responseType: "arraybuffer",
    });
    return audioResponse.data;
}


interface License {
    /**
     * Name of the license.
     */
    name: string;
    /**
     * URL of the license.
     */
    url: string;
  }
  
  interface Phonetic {
    /**
     * Text representation of the phonetic transcription.
     */
    text: string;
    /**
     * URL to the audio file for pronunciation.
     */
    audio: string;
    /**
     * Optional source URL for the phonetic.
     */
    sourceUrl?: string;
    /**
     * Optional license details for the phonetic.
     */
    license?: License;
  }
  
  interface Definition {
    /**
     * The actual definition of the word.
     */
    definition: string;
    /**
     * Optional example usage of the word in context.
     */
    example?: string;
    /**
     * List of synonyms for the definition.
     */
    synonyms: string[];
    /**
     * List of antonyms for the definition.
     */
    antonyms: string[];
  }
  
  interface Meaning {
    /**
     * Part of speech associated with the word (e.g., noun, verb).
     */
    partOfSpeech: string;
    /**
     * Array of definitions for the part of speech.
     */
    definitions: Definition[];
    /**
     * Synonyms specific to the meaning.
     */
    synonyms: string[];
    /**
     * Antonyms specific to the meaning.
     */
    antonyms: string[];
  }
  
  interface WordData {
    /**
     * The word being defined.
     */
    word: string;
    /**
     * Optional phonetic transcription of the word.
     */
    phonetic?: string;
    /**
     * Array of phonetic information, including audio and licensing.
     */
    phonetics: Phonetic[];
    /**
     * Array of meanings grouped by parts of speech.
     */
    meanings: Meaning[];
    /**
     * Optional license details for the word data.
     */
    license?: License;
    /**
     * Array of source URLs for the word data.
     */
    sourceUrls: string[];
  }