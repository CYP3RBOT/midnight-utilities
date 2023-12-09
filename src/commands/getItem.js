const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getItem = require("../utils/getItem");
const { colors } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-item")
    .setDescription("Get an item from the inventory")
    .addStringOption((option) =>
      option.setName("item").setDescription("The item to get").setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const item = interaction.options.getString("item");

    await getItem(item)
      .then((category) => {
        if (!category) {
          interaction.editReply({
            content: `Could not find item \`${item}\``,
            ephemeral: true,
          });
        } else {
          const embed = new EmbedBuilder()
            .setTitle("Item Found")
            .setDescription(
              `Found item \`${item}\` in category \`${category}\``
            )
            .setColor(colors.green)
            .setTimestamp()
            .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            });

          interaction.editReply({ embeds: [embed] });
        }
      })
      .catch((e) => {
        console.error(e);
        interaction.editReply({
          content: "An error occurred while fetching the item.",
          ephemeral: true,
        });
      });
  },
};
