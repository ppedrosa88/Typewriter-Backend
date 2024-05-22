const express = require('express');
const { createApiKey, getApiKeys, deleteApiKey } = require('../controllers/apiKeyController');

const apiKeyRouter = express.Router();

apiKeyRouter.get('/', getApiKeys);
apiKeyRouter.post('/', createApiKey);
apiKeyRouter.delete('/:id', deleteApiKey);


module.exports = apiKeyRouter;