const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const {
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const { colors } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from youtube"),
  async execute(interaction) {
    // Check if the user is in a voice channel
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: "You must be in a voice channel to use this command!",
        ephemeral: true,
      });
      return;
    }

    // Check if the bot is in a voice channel
    if (!interaction.guild.me.voice.channel) {
      await interaction.reply({
        content: "I'm not in a voice channel!",
        ephemeral: true,
      });
      return;
    }

    // Check if the user is in the same voice channel as the bot
    if (
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    ) {
      await interaction.reply({
        content: "You must be in the same voice channel as me!",
        ephemeral: true,
      });
      return;
    }

    // Check if the bot is already playing audio
    if (
      interaction.guild.me.voice.connection.state.status ===
      VoiceConnectionStatus.Playing
    ) {
      await interaction.reply({
        content: "I'm already playing audio!",
        ephemeral: true,
      });
      return;
    }

    // Play the audio
    const player = interaction.client.player;
    const connection = interaction.guild.me.voice.connection;
    const queue = interaction.client.queue;

    const song = queue.get(interaction.guild.id).songs[0];
    const stream = await player.stream(song.url);

    const audioPlayer = connection.subscribe(stream);
    audioPlayer.on("error", (error) => {
      console.error(error);
      interaction.editReply({
        content: `Error: ${error}`,
        ephemeral: true,
      });
    });

    const embed = new EmbedBuilder()
      .setTitle("Now Playing")
      .setDescription(`[${song.title}](${song.url})`)
      .setColor(colors.green)
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.editReply({ embeds: [embed] });
  },
};
