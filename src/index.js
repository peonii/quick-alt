const { Client, Intents, Collection } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const app = express()
const cron = require('./cron/cron')

dotenv.config()

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
})

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file))

    client.commands.set(command.data.name, command)
}

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file)) // mhm
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args))
    }
}

client.login(process.env.BOT_TOKEN)