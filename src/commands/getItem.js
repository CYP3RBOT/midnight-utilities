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

    await getItem(item)
      .then((result) => {
        const category = result;
        if (!category) {
          interaction.reply({
            content: `Could not find item \`${item}\``,
            ephemeral: true,
          });
        } else {
          const embed = new EmbedBuilder()
            .setTitle("Item Found")
            .setDescription(
              `Found item \`${item}\` in category \`${category}\``
            );

          interaction.reply({ embeds: [embed] });
        }
      })
      .catch((e) => {
        console.error(e);
        interaction.reply({
          content: "An error occurred while fetching the item.",
          ephemeral: true,
        });
      });
  },
};
