/*
 * server.js · sobe a API na porta do ambiente (Render, alwaysdata ou local).
 */
const { openDatabase } = require('./db/connection')
const { createApp } = require('./app')

const port = Number(process.env.PORT) || 3333
createApp(openDatabase()).listen(port, () => console.log(`Niky API em http://localhost:${port}`))
/* fim de server.js */
