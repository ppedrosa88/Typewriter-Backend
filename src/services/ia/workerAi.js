const generatePostWithAI = async ({ prompt, typeContent }) => {
    if (!prompt || prompt === '') return

    if (!typeContent || typeContent === '') return

    const role = (() => {
        switch (typeContent) {
            case 'blog':
            case 'news':
                return 'Rescribe en Español el texto con tus propias palabras, sin presentaciones ni apuntes. Que ocupe las menos palabras posibles y tenga un máximo de 876 caracteres'
            case 'facebook':
                return 'Rescribe en Español el texto con tus propias palabras, sin presentaciones ni apuntes. Que ocupe las menos palabras posibles y tenga un máximo de 350 caracteres.  Ademas debes añadir algún hashtag'
            case 'linkedin':
                return 'Rescribe en Español el texto con tus propias palabras, sin presentaciones ni apuntes. Que ocupe las menos palabras posibles y tenga un máximo de 350 caracteres.  Ademas debes añadir algún hashtag'
            case 'twitter':
                return 'Escribe en Español un texto relacionado al siguiente con tus propias palabras, sin presentaciones ni apuntes. Que ocupe las menos palabras posibles y tenga un máximo de 280 caracteres. Ademas debes añadir algún hashtag'
            case 'title':
                return 'Rescribe en Español el titulo con tus propias palabras. Lo que escribas no debe de tener más de 255 caracteres y no debe de tener sin presentaciones ni apuntes para mi. '
        }
    })()

    try {
        const messages = [
            {
                "role": "system",
                "content": role
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        const response = await fetch('https://api.cloudflare.com/client/v4/accounts/4d01894547131e7ee97448e1c67dcb57/ai/run/@hf/thebloke/neural-chat-7b-v3-1-awq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer f5_msa6IhzxYTxIAFPqMLFs5lZQfSZy4BlcaGJkm`
            },
            body: JSON.stringify({ messages })
        })

        const { result } = await response.json();
        return result.response;

    } catch (error) {
        console.log(error)
    }
}


module.exports = { generatePostWithAI }