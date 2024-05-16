// Create a version of this paragraph, intended to be part of a blog:

const prompts = {
    title: 'Create a version of this post title. Please provide the rephrased title directly.',
    blog: 'Transforma este parrafo con palabras distintas. Este parrafo es parte de un blog, necesito que lo reescribas:',
    news: 'Transforma este parrafo con palabras distintas destinado a ser una noticia, debe de tener entre 375 y 500 palabras como máximo::',
    facebook: 'Transforma este parrafo con palabras distintas destinado a ser una publicación en facebook:',
    linkedin: 'Transforma este parrafo con palabras distintas destinado a ser una publicación en linkedIn:',
    twitter: 'Transforma este parrafo con palabras distintas destinado a ser una publicación en twitter:',
}

const typeOfPrompt = (category = 'title') => {
    switch (category) {
        case 'news':
            return prompts.news;
        case 'blog':
            return prompts.blog;
        case 'facebook':
            return prompts.facebook;
        case 'linkedin':
            return prompts.linkedin;
        case 'twitter':
            return prompts.twitter;
        default:
            return prompts.title;
    }
}

module.exports = { prompts, typeOfPrompt }