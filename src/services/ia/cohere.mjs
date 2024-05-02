import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const generate = async ({ prompt }) => {
    const response = await cohere.generate({
        model: "command-r-plus",
        prompt: `Transforma este parrafo con palabras distintas: ${prompt}`,
        maxTokens: 1000,
        temperature: 0.9,
        k: 0,
        stopSequences: [],
        returnLikelihoods: "NONE"
    });
    return response.generations[0].text;
};

