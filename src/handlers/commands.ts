import { Client, CommandInteraction } from "discord.js"

export async function handleCommand(client: Client, interaction: CommandInteraction) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return interaction.reply({ content: 'Command not found!' })

    try {
        await command.execute(client, interaction)
    } catch (err) {
        console.error(err)
        await interaction.channel?.send({ content: 'Something went wrong!' })
    }
}