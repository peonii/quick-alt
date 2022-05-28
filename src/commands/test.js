const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command'),
    async execute(client, interaction) {
        await interaction.reply({ content: 'Test command executed!' })
    }
}