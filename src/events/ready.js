const {cronJobs} = require('../cron/cron')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        cronJobs(client)
        console.log(`Logged in as ${client.user.tag}!`)
    }
}