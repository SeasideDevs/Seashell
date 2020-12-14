module.exports = {
    name: 'dscgg',
    description: 'Gets info on a [dsc.gg](https://dsc.gg) link.',
    ownerOnly: true,
    guildOnly: false,
    args: true,
    cooldown: 3,
    usage: '<part after the links slash>',
    category: "utility",
    execute(msg, args, client, config, prefix, axios, Discord, avatar, blacklist) {
        const errors = require(`../snippets/dscgg.json`)
        const Link = require('dsc.js')
        const dscgg = new Link.Client(process.env.DSCGG_TOKEN)
        const input = args[0]
        if (input.length > 25) {
            return msg.channel.send(`You cannot lookup links longer than 25 characters`)
        }

        const upperCase = (type) => {
            let letters = type.split(``)
            // removes first item from array future me
            const firstLetter = letters[0]
            letters.shift()
            letters.unshift(firstLetter.toUpperCase())
            return letters.join(``)
        }

        async function run() {
            const data = await dscgg.fetchLink(input)
            if (!data.success) {
                if (data.code === errors.notfound) {
                    msg.channel.send(`That link does not exist`)
                } else if (data.code === errors.protected) {
                    msg.channel.send(`You cannot see info about this link as its password protected`)
                } else {
                    msg.channel.send(`There was an error fetching that link`)
                }
                return;
            }
            const owner = await client.users.fetch(data.payload.owner)
            const type = await upperCase(data.payload.type)
            const embed = await new Discord.MessageEmbed()
                .setColor(config.mainColor)
                .setAuthor(data.payload.id)
                .setThumbnail(data.payload.meta.image)
                .addField(`Owner:`, `**Username:** ${owner.tag}`)
                .addField(`Info:`, `**Type:** ${type}\n**Redirect:** ||${data.payload.redirect}||`)
                .addField(`Stats:`, `placeholder`)
                .addField(`Embed:`, `placeholdetr`)

            msg.channel.send(embed)
            console.log(owner)
            console.log(data)
        }

        run()
    }
}