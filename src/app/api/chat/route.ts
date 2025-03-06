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
            Task:
    Whenever the user provides a list of ingredients and serving size, generate an estimated Supplement Facts table. If specific nutritional values are not provided, use general nutritional databases or reasonable estimates. The output should be formatted in a structured table.
    
    Steps to Follow:
    
    1. Analyze the Ingredients:
    
    Identify the key macronutrients (Carbohydrates, Proteins, Fats).
    
    Identify vitamins, minerals, amino acids, herbal extracts, or other special compounds.
    
    2. Estimate Nutritional Values:
    
    Use general nutritional data for common ingredients.
    
    Provide calories, macronutrient breakdown (carbs, sugars, protein, fats), and micronutrient content.
    
    If herbal extracts or additional compounds (e.g., ginseng, royal jelly) are included, list their standard serving amounts.
    
    
    3. Format the Output as a Supplement Facts Table:
    
    Use "Per Serving" (e.g., 15g sachet) as the reference.
    
    Include % Daily Value (DV) based on a 2,000-calorie diet when applicable.
    
    Clearly indicate if values are estimates and require lab verification.
    
    
    Example Input:
    
    Ingredients: Natural Flower Honey, Wild Clove, Vitamin C, B6, E, D, Zinc, Calcium, Magnesium, Arginine, Ginger, Cinnamon, Ginseng (optional), Royal Jelly (optional).
    
    Serving Size: 15g per sachet.
    
    Expected Output Format: (RETURN ONLY THE TABLE HTML CODE. DO NOT ADD ANY ADDITIONAL TEXT.)
    
        <table>
            <thead>
                th>Supplement Facts</th>
                <th>Per Serving 15g</th>
                <th>% Daily (DV)</th>
            </thead>
            <tbody>
                <tr>
                    <td>Calories</td>
                    <td>45</td>
                    <td>2%</td>
                </tr>
                <tr>
                    <td>Total Carbonhydrat</td>
                    <td>12.36</td>
                    <td>4%</td>
                </tr>
                    .
                    .
                    .
            </tbody>
        </table>
        `
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
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
            temperature: 0,
        });

        return NextResponse.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Failed to generate supplement facts." }, { status: 500 });
    }
}
