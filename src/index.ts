import { Client, Intents, Collection } from 'discord.js'
import Discord from 'discord.js'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import cronJobs from './cron/cron'
import { SlashCommandBuilder } from '@discordjs/builders'
import { guildId } from '../bot.config.json'
import DiscordEvent from './types/event'
import Command from './types/command'

dotenv.config()

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>
    }
}

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

async function updateSlashCommands() {
    const commandsArray = []
    const commandsPath = path.join(__dirname, 'commands')
    const commandFiles = fs.readdirSync(commandsPath).filter(file => (file.endsWith('.ts') || file.endsWith('js')))

    for (const file of commandFiles) {
        const command: Command = await import(`${__dirname}/commands/${file}`)
        console.log(`Registering command ${command.data.name}`)
        client.commands.set(command.data.name, command)
        commandsArray.push(command.data.toJSON())
    }


    // Global registration
    // await client.application?.commands.set(commandsArray)

    const guild = await (await client.guilds.fetch(guildId)).commands.set(commandsArray)
    console.log(await client.application?.commands.set(commandsArray));
}

client.once('ready', async () => {
    if (client.user == null) throw new Error('User does not exist on client!')
    console.log(`Logged in as ${client.user.tag}!`)
    await updateSlashCommands()
    cronJobs(client)
    console.log('Ready!')
})

async function registerEvents() {
    const eventsPath = path.join(__dirname, 'events')
    const eventFiles = fs.readdirSync(eventsPath).filter(file => (file.endsWith('.ts') || file.endsWith('js')))

    for (const file of eventFiles) {
        const event: DiscordEvent = await import(path.join(eventsPath, file)) // mhm
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args))
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args))
        }
    }
}

registerEvents()

client.login(process.env.BOT_TOKEN)