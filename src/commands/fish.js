const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fish")
    .setDescription("The almighty fish command"),
  async execute(interaction) {
    for (let i = 0; i < 3; i++) {
      await interaction.channel.send("FISH");
    }
  },
};
