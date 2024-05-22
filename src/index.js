const Server = require('./models/server');
const { automationTimerActivator } = require('./services/automation/automationTimer');
const { scheduleTimerActivator } = require('./services/schedule/scheduleTimer');
require('dotenv').config();


const server = new Server();

scheduleTimerActivator();
automationTimerActivator();

server.listen();