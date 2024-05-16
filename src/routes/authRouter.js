const express = require('express');
const { createUser, getAllUsers, loginUser, deleteUser, updateUser, getUser, refreshToken } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/', getAllUsers);
authRouter.get('/:id', getUser);
authRouter.post('/', createUser);
authRouter.patch('/:id', updateUser);
authRouter.delete('/:id', deleteUser);

authRouter.post('/login', loginUser);
authRouter.post('/refresh', refreshToken);

module.exports = authRouter;