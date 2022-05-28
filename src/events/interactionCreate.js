const handleCommand = require('../handlers/commands')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isCommand()) return handleCommand(client, interaction)
        if (interaction.isModalSubmit()) {
            const sayMessage = interaction.fields.getTextInputValue('saymessage')

            interaction.reply({ content: `${sayMessage}` })
        }
    }
}