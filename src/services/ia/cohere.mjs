import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const generateTitle = async (prompt) => {
    const response = await cohere.generate({
        model: "command-r-plus",
        prompt: `Crea un título en Español, sin presentaciones ni apuntes, a partir del siguiente título: ${prompt}`,
        maxTokens: 10,
        temperature: 0.9,
        k: 0,
        stopSequences: [],
        returnLikelihoods: "NONE"
    });
    return response.generations[0].text;
}

// export const generate = async ({ prompt, promptByCategory }) => {
//     const response = await cohere.generate({
//         model: "command-r-plus",
//         prompt: `promptByCategory ${prompt}`,
//         maxTokens: 500,
//         temperature: 0.9,
//         k: 0,
//         stopSequences: [],
//         returnLikelihoods: "NONE"
//     });
//     return response.generations[0].text;
// };



// export const generateSummary = async (prompt) => {
//     const response = await fetch('https://api.cloudflare.com/client/v4/accounts/4d01894547131e7ee97448e1c67dcb57/ai/run/@hf/thebloke/neural-chat-7b-v3-1-awq', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer f5_msa6IhzxYTxIAFPqMLFs5lZQfSZy4BlcaGJkm`
//         },
//         body: JSON.stringify({

//             "messages": [
//                 {
//                     "role": "system",
//                     "content": "Rescribe el texto con tus propias palabras, sin presentaciones. Que ocupe las menos palabras posibles y tenga un máximo de 876 caracteres"
//                 },
//                 {
//                     "role": "user",
//                     "content": "Situada en a los pies de la Sierra de Gredos y atravesada por el río Tietar, al norte de Cáceres, este valle ofrece increíbles paisajes salpicados de gargantas y ríos que forman piscinas naturales donde refrescarte en verano, además de pueblos de piedra y entramados de madera que te trasladarán a otra época. Pero no solo eso, La Vera también se conoce por sus excelentes rutas de senderismo, monasterios históricos y una excelente gastronomía en la que no falta el embutido ibérico y el pimentón como dos de sus máximos exponentes."
//                 }
//             ]

//         })
//     })
//     // console.log(response)
//     return response;
// }

// console.log(generateSummary())