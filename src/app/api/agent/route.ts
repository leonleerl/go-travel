import { generateTravelPrompt } from "@/lib/prompt";
import { callOpenAI } from "@/utils/openai";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const body = await req.json();
    const prompt = generateTravelPrompt(body);
    const result = await callOpenAI(prompt);
    return NextResponse.json({ result });
}