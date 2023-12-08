import os
from dotenv import load_dotenv
import discord
from discord import app_commands

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
GUILD_ID = os.getenv('GUILD_ID')
CLIENT_ID = os.getenv('CLIENT_ID')

intents = discord.Intents.default()
client = discord.Client(intents = intents)
tree = app_commands.CommandTree(client)

@tree.command(name = "ping", 
              description = "The bot says pong!", 
              guild = discord.Object(id = GUILD_ID)) # Add the guild ids in which the slash command will appear. If it should be in all, remove the argument, but note that it will take some time (up to an hour) to register the command if it's for all guilds.
async def first_command(interaction):
    await interaction.response.send_message("Pong!")

@client.event
async def on_ready():
    await tree.sync(guild = discord.Object(id = GUILD_ID))
    print(f'Logged in as {client.user}')


client.run(BOT_TOKEN)
