import { Client, GatewayIntentBits, Collection } from 'discord.js'
import Discord from 'discord.js'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { SlashCommandBuilder } from '@discordjs/builders'
import { guildId } from '../bot.config.json'
import DiscordEvent from './types/event'
import { Command } from './types/command'

dotenv.config()

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>
        cooldowns: Collection<string, Collection<string, Date>>
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ],
})

client.commands = new Collection()
client.cooldowns = new Collection()

function getAllFiles(dirPath: string, arrayOfFiles: Array<string> = []) {
	const files = fs.readdirSync(dirPath);

	files.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
		}
		else if ((file.endsWith(".js") || file.endsWith('.ts')) && !file.startsWith('.')) {
			arrayOfFiles.push(path.join(dirPath, file));
		}
	});

	return arrayOfFiles;
}

async function registerCommands() {
    const commandsArray = []
    const commandsPath = path.join(__dirname, 'commands')
    const commandFiles = getAllFiles(commandsPath)

    for (const file of commandFiles) {
        const { command } = await import(file)
        console.log(`Registering command ${command.data.name}`)
        client.commands.set(command.data.name, command)
        commandsArray.push(command.data.toJSON())
        client.cooldowns.set(command.data.name, new Collection())
    }

    // Global registration
    // Uncomment the following line to globally register commands
    await client.application?.commands.set([])
    await client.application?.commands.set(commandsArray)

    // Comment this line if you're registering commands globally
    //const guild = await (await client.guilds.fetch(guildId)).commands.set(commandsArray)
}

client.once('ready', async () => {
    if (client.user == null) throw new Error('User does not exist on client!')
    console.log(`Logged in as ${client.user.tag}!`)
    registerCommands()
    console.log('Ready!')
})

async function registerEvents() {
    const eventsPath = path.join(__dirname, 'events')
    const eventFiles = fs.readdirSync(eventsPath).filter(file => (file.endsWith('.ts') || file.endsWith('.js')))

    for (const file of eventFiles) {
        console.log('Registering event ' + file)
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