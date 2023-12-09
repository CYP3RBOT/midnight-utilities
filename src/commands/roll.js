const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { colors } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("roll dice")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number of dice")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("dice type")
        .setRequired(true)
        .setChoices(
          { name: "d4", value: "d4" },
          { name: "d6", value: "d6" },
          { name: "d8", value: "d8" },
          { name: "d10", value: "d10" },
          { name: "d12", value: "d12" },
          { name: "d20", value: "d20" },
          { name: "d100", value: "d100" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("modifier")
        .setDescription("Modifiy dice roll")
        .setRequired(false)
    ),

  async execute(interaction) {
    const dice_type = interaction.options.getString("type");
    const dice_num = interaction.options.getInteger("number");
    const dice_mod = interaction.options.getInteger("modifier");

    const min = 1;
    let max = 0;
    let random = 0;

    switch (dice_type) {
      case "d4":
        max = 4;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is " + random);
        break;

      case "d6":
        max = 6;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;

      case "d8":
        max = 8;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;

      case "d10":
        max = 10;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;

      case "d12":
        max = 12;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;

      case "d20":
        max = 20;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;

      case "d100":
        max = 100;

        for (let i = 0; i < dice_num; i++) {
          random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
        }

        random = random + dice_mod;

        await interaction.reply("Your number is" + random);
        break;
    }
  },
};
