const express = require('express');
const { getBlogs, getBlogById, iaBlog, postBlog, updateBlog, deleteBlog, totallyDeleteBlog } = require('../controllers/blogController');

const blogRouter = express.Router();

blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlogById);
blogRouter.post('/ia', iaBlog);
blogRouter.post('/', postBlog);
blogRouter.patch('/:id', updateBlog);
blogRouter.delete('/:id', deleteBlog);
blogRouter.delete('/trash/:id', totallyDeleteBlog);


module.exports = blogRouter;