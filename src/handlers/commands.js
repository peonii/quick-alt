
module.exports = async function handleCommand(client, interaction) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return interaction.reply({ content: 'Command not found!' })

    try {
        await command.execute(client, interaction)
    } catch (err) {
        console.error(err)
        await interaction.channel.send({ content: 'Something went wrong!', ephemeral: true })
    }
}