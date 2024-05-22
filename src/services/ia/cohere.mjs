import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const generateTitle = async (prompt) => {
    const response = await cohere.generate({
        model: "command-r-plus",
        prompt: `Crea un título en Español, sin presentaciones ni apuntes, a partir del siguiente título: ${prompt}`,
        maxTokens: 12,
        temperature: 0.9,
        k: 0,
        stopSequences: [],
        returnLikelihoods: "NONE"
    });
    return response.generations[0].text;
}

