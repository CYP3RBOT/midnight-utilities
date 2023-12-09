const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { databaseAdmin, colors } = require("../../config.json");
const removeItem = require("../utils/removeItem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-item")
    .setDescription("Remove an item from the inventory")
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
      option
        .setName("item")
        .setDescription("The item to remove")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(databaseAdmin)) {
      await interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");

    const embed = new EmbedBuilder()
      .setTitle("Removed Item")
      .setDescription(`Removed \`${item}\` from \`${category}\``)
      .setColor(colors.green)
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await removeItem(category, item)
      .then(() => {
        interaction.editReply({ embeds: [embed] });
      })
      .catch((error) => {
        interaction.editReply({ content: `Error: ${error}`, ephemeral: true });
      });
  },
};

// TODO: Add a check to see if the item already exists in the database
