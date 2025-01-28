import { getConfigValue } from "@/utils/config";
import { debug } from "@/utils/debug";
import OpenAI from "openai";


const OPENAI_API_KEY = getConfigValue("openaiApiKey");
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

/**
 * Get the response from OpenAI
 * @param prompt Prompt to send to OpenAI
 * @returns Response from OpenAI
 */
export async function defineWord(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are an assistant that acts as a dictionary. You help users define words and phrases. You also provide information about the word, such as synonyms, antonyms, and usage in a sentence.",
            },
            {
                role: "user",
                content: prompt,
            },
            {
                role: "assistant",
                content: `Define the word and provide information about it. 
                Include the meaning, synonyms, antonyms, and usage in a sentence.
                Provide output in a html elements with basic formatting and no styling. 
                Use new lines for appropriate formatting and readability.
                Do not include any unnecessary information and keep the response concise.
                Do not return any code or code snippets. Do not return below format as it is.
                Strictly use the following format and structure. Do not deviate from the format.:
{{emoji}} <i>Hello</i>

Used to greet someone, especially in a formal way.

<b>Synonyms</b> 
<i>hi</i>, <i>howdy</i>, <i>hey</i>

<b>Antonyms</b> 
<i>goodbye</i>, <i>farewell</i>

<b>Usage:</b> 
<u><b>Hello</b></u> is used to greet someone when you meet them.
                `,
            }
        ],
        model: 'gpt-3.5-turbo'
    });
    return response.choices[0].message.content || "";
}

/**
 * Solve a GRE question from OpenAI
 * @param prompt Question to solve
 * @returns Response from OpenAI
 */
export async function solveGREQuestion(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Understand the question and nuances and solve the GRE question carefully and correctly, and explain the reasoning behind the answer.
                If provided prompt does not resemble a question, do not presume or create question and return message stating that the prompt is not a question.
                Do not include any unnecessary information and keep the response concise.
                Following are the only html elements that are allowed: <b>, <i>, <s>, <del>, <u>.
                Strictly utilise the above html elements to format the text as required. Do not use any other html elements and Do not use any css or Markdown or MathML or Escape characters.
                Strictly use the following format and structure. Do not deviate from the format.:
{{emoji}} <b>Question</b>
Who is the president of the United States?
A. John Doe
B. Jane Doe
C. Joe Biden
D. Donald Trump

<b>Answer</b>
C. Joe Biden

<b>Explanation</b>
Explanation text goes here. with reasoning and steps, Do appropriate styling using allowed html elements only.`,
            },
            {
                role: "user",
                content: prompt,
            }
        ],
        model: 'gpt-4o-mini-2024-07-18'
    });
    return response.choices[0].message.content || "";
}

/**
 * Get a GRE quiz question from OpenAI
 * @param type Type of question to get
 * @returns GRE question
 */
export async function getGREQuiz(type: string): Promise<Question | null> {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are and assistant that generate a hard or medium GRE question which is very similar to actual GRE questions (${type}) with multiple choices and provide the correct answer.
                Generate a question that is challenging and should NOT be easily arithmetically solvable and should require logical reasoning or critical thinking.
                Do not include any unnecessary information and keep the response concise.
                Following are the only html elements that are allowed: <b>, <i>, <s>, <del>, <u>.
                Strictly utilise the above html elements to format the text as required. Do not use any other html elements and Do not use any css or Markdown or MathML or Escape characters.
                Strictly use the following JSON format and structure. Do not deviate from the format.:
{
    "question": "What is the capital of France?",
    "choices": ["London", "Paris", "Berlin", "Madrid"],
    "answer": "Paris",
    "answer_index": 1,
    "explanation": "Paris is the capital of France."
    "difficulty": "medium"
}`,
            }
        ],
        model: 'gpt-4o-mini-2024-07-18',
        response_format: { type: "json_object" }
    });
    try {
        return JSON.parse(response.choices[0].message.content || "{}");
    } catch (e) {
        debug("Error parsing response", e);
    }
    return null;
}

export interface Question {
    question: string;
    choices: string[];
    answer: string;
    answer_index: number;
    explanation: string;
    difficulty: string;
}