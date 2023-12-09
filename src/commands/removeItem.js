const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { databaseAdmin, colors } = require("../../config.json");
const removeItem = require("../utils/removeItem");
const getItem = require("../utils/getItem");

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
          { name: "Assets", value: "assets" },
          { name: "Items of Importance", value: "items-of-importance" },
          {
            name: "Consumable Items of Magicness",
            value: "consumable-items-of-magicness",
          },
          { name: "Items of Magicness", value: "items-of-magicness" },
          { name: "Items of Not Magicness", value: "items-of-not-magicness" },
          { name: "Boat Supplies", value: "boat-supplies" }
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

    const success = await getItem(item)
      .then((result) => {
        if (result) return true;
      })
      .catch((error) => {
        interaction.editReply({ content: `Error: ${error}`, ephemeral: true });
      });

    if (success) {
      await removeItem(category, item)
        .then(() => {
          interaction.editReply({ embeds: [embed] });
        })
        .catch((error) => {
          interaction.editReply({
            content: `Error: ${error}`,
            ephemeral: true,
          });
        });
    } else {
      interaction.editReply({
        content: `Error: \`${item}\` does not exist in \`${category}\``,
        ephemeral: true,
      });
    }
  },
};

// TODO: Add a check to see if the item already exists in the database
