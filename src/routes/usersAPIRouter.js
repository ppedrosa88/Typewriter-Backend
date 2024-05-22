const express = require('express');
const { getBlogs, getBlogById, deleteBlog, totallyDeleteBlog } = require('../controllers/usersAPIController');

const usersAPIRouter = express.Router();

usersAPIRouter.get('/:token/blogs', getBlogs);
usersAPIRouter.get('/:token/blog/:id', getBlogById);
usersAPIRouter.patch('/:token/trash/:id', deleteBlog);
usersAPIRouter.delete('/:token/trash/:id', totallyDeleteBlog);

module.exports = usersAPIRouter;