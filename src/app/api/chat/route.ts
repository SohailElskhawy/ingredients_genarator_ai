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
Generate an estimated Supplement Facts table based on the provided ingredients and serving size. Use general nutritional data if exact values are unavailable. 

- Do not include any nutrients where the value is 0.
- Ensure that % Daily Value (DV) does not exceed 100%.
- List all relevant macronutrients (calories, carbohydrates, proteins, fats) and micronutrients (vitamins, minerals, amino acids, herbal extracts, etc.).
- If an ingredient is present but its nutritional value is unknown, estimate based on similar known ingredients.
- Format the output **strictly as an HTML table**, without any additional text.

Example Input:
Ingredients: Natural Flower Honey, Wild Clove, Vitamin C, B6, E, D, Zinc, Calcium, Magnesium, Arginine, Ginger, Cinnamon, Ginseng (optional), Royal Jelly (optional).
Serving Size: 15g per sachet.

Expected Output:
<table>
    <thead>
        <th>Supplement Facts</th>
        <th>Per Serving 15g</th>
        <th>% Daily (DV)</th>
    </thead>
    <tbody>
        <tr><td>Calories</td><td>45</td><td>2%</td></tr>
        <tr><td>Total Carbohydrates</td><td>12.36g</td><td>4%</td></tr>
        <tr><td>Protein</td><td>0.5g</td><td>1%</td></tr>
        <tr><td>Vitamin C</td><td>25mg</td><td>28%</td></tr>
        <tr><td>Calcium</td><td>20mg</td><td>2%</td></tr>
        ...
    </tbody>
</table>
`;



        
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
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
            temperature: 0.2,
            max_tokens:800,
        });

        return NextResponse.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Failed to generate supplement facts." }, { status: 500 });
    }
}
