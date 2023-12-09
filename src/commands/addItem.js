const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { databaseAdmin, colors } = require("../../config.json");
const addItem = require("../utils/addItem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-item")
    .setDescription("Add an item to the inventory")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the item")
        .setRequired(true)
        .setChoices(
          { name: "Items of Goldness", value: "items-of-goldness" },
          { name: "Assets", value: "assets" }
        )
    )
    .addStringOption((option) =>
      option.setName("item").setDescription("The item to add").setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(databaseAdmin)) {
      await interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
      return;
    }

    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");

    const embed = new EmbedBuilder()
      .setTitle("Added Item")
      .setDescription(`Added \`${item}\` to \`${category}\``)
      .setColor(colors.green)
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await addItem(category, item)
      .then(() => {
        interaction.reply({ embeds: [embed] });
      })
      .catch((error) => {
        interaction.reply({ content: `Error: ${error}`, ephemeral: true });
      });
  },
};
