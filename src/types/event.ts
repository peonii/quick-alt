import { Client } from 'discord.js'

export default interface DiscordEvent {
    name: string
    execute(client: Client, ...args: any): Promise<void>
    once?: boolean
}