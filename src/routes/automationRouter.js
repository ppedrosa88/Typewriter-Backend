const express = require('express');
const { createAutomation, updateAutomation, deleteAutomation, getAutomations, getAutomationsById } = require('../controllers/automationController');

const automationRouter = express.Router();

automationRouter.get('/', getAutomations);
automationRouter.get('/:id', getAutomationsById);
automationRouter.post('/', createAutomation);
automationRouter.patch('/:id', updateAutomation);
automationRouter.delete('/:id', deleteAutomation);


module.exports = automationRouter;