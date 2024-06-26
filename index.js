const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// Command handler
const commandFiles = fs.readdirSync(path.join(__dirname, 'src', 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'src', 'commands', file));
  client.commands.set(command.data.name, command);
}

// Event handler
const eventFiles = fs.readdirSync(path.join(__dirname, 'src', 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(__dirname, 'src', 'events', file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token);
