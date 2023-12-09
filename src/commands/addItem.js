const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { databaseAdmin } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addItem")
    .setDescription("Add an item to the inventory"),
  async execute(interaction) {
    if (!interaction.user.roles.cache.has(databaseAdmin)) {
      await interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
      return;
    }
  },
};
