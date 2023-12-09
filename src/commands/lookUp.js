const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const axios = require("axios");
const baseURL = "https://www.dnd5eapi.co";
const { colors } = require("../../config.json");

const apis = {
  "ability-scores": "/api/ability-scores",
  alignments: "/api/alignments",
  backgrounds: "/api/backgrounds",
  classes: "/api/classes",
  conditions: "/api/conditions",
  "damage-types": "/api/damage-types",
  equipment: "/api/equipment",
  "equipment-categories": "/api/equipment-categories",
  feats: "/api/feats",
  features: "/api/features",
  languages: "/api/languages",
  "magic-items": "/api/magic-items",
  "magic-schools": "/api/magic-schools",
  monsters: "/api/monsters",
  proficiencies: "/api/proficiencies",
  races: "/api/races",
  "rule-sections": "/api/rule-sections",
  rules: "/api/rules",
  skills: "/api/skills",
  spells: "/api/spells",
  subclasses: "/api/subclasses",
  subraces: "/api/subraces",
  traits: "/api/traits",
  "weapon-properties": "/api/weapon-properties",
};

function capitalizeAllWords(string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("look-up")
    .setDescription("Look up something in the D&D 5e API")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category to look up")
        .setRequired(true)
        .addChoices(
          { name: "Monsters", value: "monsters" },
          { name: "Spells", value: "spells" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("The search term")
        .setRequired(true)
    ),

  async execute(interaction) {
    const category = interaction.options.getString("category");

    const search = interaction.options.getString("search");

    const url =
      baseURL + apis[category] + `/${search.toLowerCase().replaceAll(" ", "")}`;

    await interaction.deferReply();

    let response;
    try {
      response = await axios.get(url);
    } catch (e) {
      if (e.response.status === 404) {
        const embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription("No results found")
          .setColor(colors.red)
          .setTimestamp()
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          });

        await interaction.editReply({ embeds: [embed] });
      }

      return;
    }
    const data = response.data;

    let basicInformationString = "";
    let hitPointsString = "";
    let attacksString = "";
    let specialAbilitiesString = "";

    for (const [key, value] of Object.entries(data)) {
      if (key === "armor_class") {
        break;
      }
      basicInformationString += `\`${capitalizeAllWords(
        key.replaceAll("_", " ")
      )}\`: ${value}\n`;
    }
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("hit")) {
        hitPointsString += `\`${capitalizeAllWords(
          key.replaceAll("_", " ")
        )}\`: ${value}\n`;
      }
      if (key === "actions") {
        for (const action of value) {
          attacksString += `\`${action.name}\`: ${action.desc}\n`;
        }
      }
      if (key === "special_abilities") {
        for (const ability of value) {
          specialAbilitiesString += `\`${ability.name}\`: ${ability.desc}\n`;
        }
      }
    }

    const embed1 = new EmbedBuilder()
      .setTitle(data.name)
      .setURL(baseURL + data.url)
      .setThumbnail(baseURL + data.image)
      .addFields(
        {
          name: "Basic Information",
          value: basicInformationString,
          inline: true,
        },
        {
          name: "HP",
          value: hitPointsString,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const attacksEmbed = new EmbedBuilder()
      .setTitle("Attacks")
      .setDescription(attacksString);
    const specialAbilitiesEmbed = new EmbedBuilder()
      .setTitle("Special Abilities")
      .setDescription(specialAbilitiesString);

    await interaction.editReply({
      embeds: [embed1, attacksEmbed, specialAbilitiesEmbed],
    });
  },
};
