module.exports = {
  name: "evall",
  description:
    "Runs Javascript code on all shards. This command is owner only and will not work for self hosted versions not using sharding",
  aliases: ["ev"],
  ownerOnly: true,
  guildOnly: false,
  args: true,
  cooldown: 3,
  usage: "<code>",
  category: "utility",
  execute(msg, args, client, config, prefix, axios, Discord, avatar, database) {
    let code = args.join(" ");
    let returned = ``;
    let success;
    const embed = new Discord.MessageEmbed()
      .addField(`📤 Original Code`, code)
      .setFooter(`Requested by ${msg.author.tag}`);

    async function run() {
      try {
        let token = code.search("client.token");
        if (token !== -1) {
          returned += `Nice Try`;
        } else {
          let rawReturned = await client.shard.broadcastEval(code);
          returned += rawReturned;
        }
        embed.addField(`📥 Result`, returned);
        embed.setAuthor(`Success!`, avatar);
        embed.setColor(config.colors.main);
        msg.react(config.emojis.success);
      } catch (e) {
        returned += e;

        embed.addField(`📥 Result`, returned);
        embed.setAuthor(`Error`, avatar);
        embed.setColor(config.colors.error);
        msg.react(config.emojis.error);
      }
      msg.channel.send(embed);
    }

    run();
  },
};
