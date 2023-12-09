const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder().setName("cat").setDescription("Look @ cat"),
  async execute(interaction) {
    let data = await axios.get("https://api.thecatapi.com/v1/images/search");
    data = data.data;

    const embed = new EmbedBuilder()
      .setTitle("Cat!")
      .setDescription("Here's a cat! ID: `" + data[0].id + "`")
      .setImage(data[0].url)
      .setTimestamp()

      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
