const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const getInventory = require("../utils/getInventory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("List the inventory"),
  async execute(interaction) {
    await interaction.deferReply();

    const inventory = await getInventory();
    const embeds = [];

    for (const category in inventory) {
      if (category === "_id") continue;
      const arr = inventory[category];
      const embed = new EmbedBuilder()
        .setTitle(category)
        .setDescription(
          arr.length > 0
            ? arr.map((item) => "- " + item.item).join("\n")
            : "None"
        )
        .setTimestamp()
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });

      embeds.push(embed);
    }

    if (embeds.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Inventory")
        .setDescription("Your inventory is empty.")
        .setTimestamp()
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    }

    let components =
      embeds.length > 1
        ? [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
            ),
          ]
        : [];

    const msg = await interaction.editReply({
      embeds: [embeds[0]],
      components,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    let currentPage = 0;

    collector.on("collect", async (i) => {
      if (i.customId === "inventoryPaginatorFirst") {
        currentPage = 0;
        await i.update({
          embeds: [embeds[currentPage]],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
            ),
          ],
        });
      } else if (i.customId === "inventoryPaginatorPrevious") {
        currentPage--;
        await i.update({
          embeds: [embeds[currentPage]],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
            ),
          ],
        });
      } else if (i.customId === "inventoryPaginatorNext") {
        currentPage++;
        await i.update({
          embeds: [embeds[currentPage]],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === embeds.length - 1),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === embeds.length - 1)
            ),
          ],
        });
      } else if (i.customId === "inventoryPaginatorLast") {
        currentPage = embeds.length - 1;
        await i.update({
          embeds: [embeds[currentPage]],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
            ),
          ],
        });
      } else if (i.customId === "inventoryPaginatorRemove") {
        await i.update({
          embeds: [embeds[currentPage]],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorFirst")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorPrevious")
                .setLabel("◀️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorRemove")
                .setLabel("❌")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorNext")
                .setLabel("▶️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("inventoryPaginatorLast")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
            ),
          ],
        });
      }
    });
  },
};
