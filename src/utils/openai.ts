import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(prompt: string) : Promise<string | null> {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{role: "user", content: prompt}],
    });

    return chatCompletion.choices[0].message.content;
}