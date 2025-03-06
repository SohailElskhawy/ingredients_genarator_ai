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
Generate an estimated Supplement Facts table based on the provided ingredients and serving size. 

- Only include the given ingredients in the "Supplement Facts" column.
- Do not add additional nutrients that were not listed in the input.
- If an ingredient's nutritional value is unknown, estimate based on similar known ingredients.
- Ensure that % Daily Value (DV) does not exceed 100%.
- Do not include any nutrients where the value is 0.
- Use only **g (grams) or mg (milligrams)** as units. Do not use mcg (micrograms) or IU.
- Format the output **strictly as an HTML table**, with no extra text.

Example Input:
Ingredients: Natural Flower Honey, Wild Marjoram, Vitamin C, D, E, B6, B12, Zinc, Magnesium, Cinnamon, Cloves, Ginger, Chamomile, *Ginseng (optional), *Royal Jelly (optional).
Serving Size: 15g per sachet.

Expected Output:
<table>
    <thead>
        <th>Supplement Facts</th>
        <th>Per Serving (15g)</th>
        <th>% Daily Value (DV)</th>
    </thead>
    <tbody>
        <tr><td>Calories</td><td>46 kcal</td><td>-</td></tr>
        <tr><td>Total Carbohydrates</td><td>12.36 g</td><td>4%</td></tr>
        <tr><td>Vitamin C</td><td>60 mg</td><td>67%</td></tr>
        <tr><td>Vitamin B6</td><td>2 mg</td><td>98%</td></tr>
        <tr><td>Vitamin B12</td><td>3 mg</td><td>90%</td></tr>
        <tr><td>Vitamin D</td><td>10 mg</td><td>67%</td></tr>
        <tr><td>Zinc</td><td>5 mg</td><td>45%</td></tr>
        <tr><td>Magnesium</td><td>50 mg</td><td>12%</td></tr>
        <tr><td>Cinnamon</td><td>200 mg</td><td>-</td></tr>
        <tr><td>Cloves</td><td>100 mg</td><td>-</td></tr>
        <tr><td>Ginger</td><td>150 mg</td><td>-</td></tr>
        <tr><td>Chamomile</td><td>100 mg</td><td>-</td></tr>
        <tr><td>Ginseng</td><td>50 mg</td><td>-</td></tr>
        <tr><td>Royal Jelly</td><td>100 mg</td><td>-</td></tr>
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
            temperature: 0.1,
        });

        return NextResponse.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Failed to generate supplement facts." }, { status: 500 });
    }
}
