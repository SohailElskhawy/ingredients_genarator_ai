import OpenAI from "openai";
import { NextResponse,NextRequest } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY, // API key should only be used on the server
});


export async function POST(req: NextRequest){
    try {
        const { text } = await req.json();
    
            if (!text) {
                return NextResponse.json({ error: "Text input is required" }, { status: 400 });
            }
    
            const systemInstructions = `
            Generate an estimated Supplement Facts table based on the provided ingredients and serving size. Use general nutritional data if exact values are unavailable. Format the response as an HTML table with macronutrients, micronutrients, and additional compounds.
        
            Example Input:
            Ingredients: Natural Flower Honey, Wild Clove, Vitamin C, B6, E, D, Zinc, Calcium, Magnesium, Arginine, Ginger, Cinnamon, Ginseng (optional), Royal Jelly (optional).
            Serving Size: 15g per sachet.
        
            Expected Output: (RETURN ONLY THE TABLE HTML CODE)
            <table>
                <thead>
                    <th>Supplement Facts</th>
                    <th>Per Serving 15g</th>
                    <th>% Daily (DV)</th>
                </thead>
                <tbody>
                    <tr><td>Calories</td><td>45</td><td>2%</td></tr>
                    <tr><td>Total Carbohydrates</td><td>12.36g</td><td>4%</td></tr>
                    ...
                </tbody>
            </table>
        `;
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a nutritionist tasked with generating a Supplement Facts table...",
                },
                {
                    role: "user",
                    content: `${systemInstructions} \n\nText:\n${text}`,
                },
            ],
            temperature: 1,
        });

        return NextResponse.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Failed to generate supplement facts." }, { status: 500 });
    }
}
