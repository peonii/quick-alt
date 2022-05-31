const { ModalAssertions } = require('@discordjs/builders')
const handleCommand = require('../handlers/commands')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.isCommand()) return handleCommand(client, interaction)
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'say') {
                const sayMessage = interaction.fields.getTextInputValue('saymessage')
                interaction.reply({ content: `${sayMessage}` })
            }
        }
    }
}