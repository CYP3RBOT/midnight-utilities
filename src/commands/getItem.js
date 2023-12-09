const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getItem = require("../utils/getItem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-item")
    .setDescription("Get an item from the inventory")
    .addStringOption((option) =>
      option.setName("item").setDescription("The item to get").setRequired(true)
    ),

  async execute(interaction) {
    const item = interaction.options.getString("item");
  },
};
