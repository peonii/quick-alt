import { SlashCommandBuilder } from '@discordjs/builders'
import crypto from 'node:crypto'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('encrypt')
        .setDescription('Encrypts a message')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to encrypt')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('hash')
                .setDescription('The hash to use')
                .setRequired(true)
                .addChoices(
                    { name: 'SHA256', value: 'sha256'},
                    { name: 'SHA512', value: 'sha512'},
                    { name: 'SHA1', value: 'sha1'},
                    { name: 'MD5', value: 'md5'}
                )),
    async execute(client, interaction) {
        const message = interaction.options.getString('message')
        const hashOption = interaction.options.getString('hash')

        const hash = crypto.createHash(hashOption)
        hash.update(message)
        const encrypted = hash.digest('hex')
        await interaction.reply({ content: encrypted })
    }
}