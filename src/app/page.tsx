"use client";
import { useState } from "react";
import Loading from "./components/Loading";
export default function Home() {
    const [prompt, setPrompt] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const generateIngredients = async (text: string) => {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate supplement facts");
        }

        const data = await response.json();
        return data.result;
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await generateIngredients(prompt);
        const cleanResponse = response.replace(/```(html)?/g, "");
        setResult(cleanResponse);
        setIsLoading(false);
    };

    return <div className="flex flex-col items-center justify-start min-h-screen py-2"
        style={{ fontFamily: "Arial, sans-serif" }}
    >
        <div className="flex flex-row items-center justify-center no-print"
        >
            <h1
                className="text-4xl font-bold"
            >Ingredients Generator</h1>
        </div>
        <div className="flex flex-col items-center justify-center">
            {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
        </div>
        <div className="flex flex-col items-center justify-center fixed bottom-0 w-full p-4 bg-white no-print">
            <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center w-1/2">
                <input type="text" placeholder="Enter your ingredients"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="p-2 m-2 border border-gray-400 rounded w-full"
                />
                <button type="submit"
                    className="p-2 m-2 bg-blue-500 text-white rounded"
                >Generate</button>
                <button onClick={() => window.print()} className="p-2 m-2 bg-blue-500 text-white rounded">
                    Print
                </button>
            </form>
        </div>
        {isLoading && <Loading />}
    </div>
}