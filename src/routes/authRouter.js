const express = require('express');
const { createUser, getAllUsers, loginUser, deleteUser, updateUser, getUser, refreshToken } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/', getAllUsers);
authRouter.post('/', createUser);
authRouter.get('/:id', getUser);
authRouter.delete('/:id', deleteUser);
authRouter.patch('/:id', updateUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refreshToken);

module.exports = authRouter;