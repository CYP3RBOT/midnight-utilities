const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");

const { colors } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from youtube")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play (youtube link)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
      await interaction.reply({
        content: "You must be in a voice channel to use this command!",
        ephemeral: true,
      });
      return;
    }

    const youtubeLink = interaction.options.getString("song");

    if (!youtubeLink.startsWith("https://www.youtube.com/watch?v=")) {
      await interaction.reply({
        content: "Invalid youtube link!",
        ephemeral: true,
      });
      return;
    }

    let success;
    try {
      success = ytdl.getURLVideoID(youtubeLink);
    } catch (error) {
      await interaction.reply({
        content: "Invalid youtube link!",
        ephemeral: true,
      });
      return;
    }

    if (success) {
      const embed = new EmbedBuilder()
        .setTitle("Playing Song")
        .setDescription(`Playing \`${youtubeLink}\``)
        .setColor(colors.green)
        .setTimestamp()
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [embed] });

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      const downloadPath = path.join(
        __dirname,
        "..",
        "audio",
        `${success}.mp3`
      );

      const download = ytdl(youtubeLink, { filter: "audioonly" });
      download.pipe(fs.createWriteStream(downloadPath));

      const resource = createAudioResource(downloadPath);
      const player = createAudioPlayer();
      player.play(resource);

      connection.subscribe(player);
    }
  },
};
