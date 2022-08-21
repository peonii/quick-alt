import { SlashCommandBuilder } from '@discordjs/builders'
import { Attachment, Client, CommandInteraction, Message } from 'discord.js'

export interface MessageCommandArguments {
    min: number
    max: number
}
export interface MessageCommand {
    name: string
    description: string
    attachment?: boolean
    execute: (client: Client, message: Message, args: Array<string>, attachment: Attachment | null | undefined) => Promise<any>
    args: MessageCommandArguments
}