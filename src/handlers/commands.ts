import { Client, CommandInteraction } from "discord.js"
import { InteractionUmbrellaType } from "../types/command"

export async function handleCommand(client: Client, interaction: InteractionUmbrellaType) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return interaction.reply({ content: 'Command not found!' })

    const now = new Date()

    if (command.cooldown > 0) {
        const cooldown = client.cooldowns.get(command.data.name)?.get(interaction.user.id)
        if (cooldown) {
            const difference = Math.ceil((now.getTime() - cooldown.getTime()) / 1000)
            if (difference < command.cooldown) {
                try {
                    await interaction.reply({ content: `You can use this command again in ${command.cooldown - difference} seconds!`, ephemeral: true })
                    return
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    try {
        await command.execute(client, interaction)
        client.cooldowns.get(command.data.name)?.set(interaction.user.id, now)
    } catch (err) {
        console.error(err)
        await interaction.channel?.send({ content: 'Something went wrong!' })
    }
}