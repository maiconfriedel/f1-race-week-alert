import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { getRacesData } from "./getRacesData";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  const message = await getRacesData();

  if (message) {
    const channels = client.channels.cache.filter(
      (a: any) => a.name.toLowerCase().indexOf("alertas-f1") >= 0
    );

    for (let index = 0; index < channels.size; index++) {
      const channel = channels.at(index);

      await (<TextChannel>channel).send(message);
    }
  }
  process.exit(0);
});

client.login(process.env.F1_ALERT_DISCORD_TOKEN);
