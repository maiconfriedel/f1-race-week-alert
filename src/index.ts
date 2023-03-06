import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { getData } from "./getData";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  const message = await getData();

  if (message) {
    const channel = client.channels.cache.find(
      (a: any) => a.name.toLowerCase().indexOf("alertas-f1") >= 0
    ) as TextChannel;

    await channel.send(message);
  }
  process.exit(0);
});

client.login(process.env.F1_ALERT_DISCORD_TOKEN);
