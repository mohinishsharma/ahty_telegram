import { getConfigValue } from "@/utils/config";
import { debug } from "@/utils/debug";
import OpenAI from "openai";
import { Blob } from "node:buffer";
import { getBase64FromBlob } from "@/utils/file";


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
 * @param image Image of the question
 * @returns Response from OpenAI
 */
export async function solveGREQuestion(prompt: string, image?: Blob): Promise<string> {
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
    content.push({ type: "text", text: prompt });
    if (image) {
        const base64 = await getBase64FromBlob(image);
        content.push({ type: "image_url", image_url: { detail: "low", url: base64 } });
    }
    

    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Understand the question and nuances and solve the GRE question. Think carefully and correctly always solve question to produce correct answer, and explain the reasoning behind the answer.
                Break down the question or image into parts and think about the possible solutions. Do not include unnecessary escape characters like \\(, \\) or \\".
                Analyse querstion carefully, answer will always be present in the option if given. only produce final answer after careful consideration.
                If unsure about the answer, try to provide the best possible answer based on the information provided in the question while explicitly stating that the answer is not certain.
                If provided prompt or image attached does not resemble a question, do not presume or create question and return message stating that the prompt is not a question.
                Do not include any unnecessary information and keep the response concise.
                Following are the only HTML elements that are allowed: <b>, <i>, <s>, <del>, <u>.
                Strictly utilise the above HTML elements to format the text as required. DO NOT use any other HTML elements that are not mentioned in allowed list and Do not use any css or Markdown or MathML or LaTex of any kind.
                If there need be any symbols or special characters, use the appropriate ascii characters representing them. Do use MathML or LaTex. Do not do unnecessary formatting and escaping of leagl characters in the HTML.
                Strictly use the following format and structure. Do not deviate from the format.:
<b>Given</b>
Information goes here.

<b>Explanation</b>
Explanation text goes here. with reasoning and steps, Do appropriate styling using allowed html elements only.

<b>Answer</b>
C. Joe Biden
`,
            },
            {
                role: "user",
                content
            },
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
    "passage": "The passage goes here. (Optional field. Include only if the question is based on a passage.)",
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
    passage?: string;
    question: string;
    choices: string[];
    answer: string;
    answer_index: number;
    explanation: string;
    difficulty: string;
}