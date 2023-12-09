const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show-item")
    .setDescription("Show an item in inventory")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item to show")
        .setRequired(true)
    ),

  async execute(interaction) {},
};
