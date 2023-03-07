import {
  AttachmentBuilder,
  Client,
  Events,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import "dotenv/config";
import { getRacesData } from "./getRacesData";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  const message = await getRacesData();

  if (message.message) {
    const channels = client.channels.cache.filter(
      (a: any) => a.name.toLowerCase().indexOf("alertas-f1") >= 0
    );

    for (let index = 0; index < channels.size; index++) {
      const channel = channels.at(index);

      if (message.image_url) {
        const attachment = new AttachmentBuilder(message.image_url);

        await (<TextChannel>channel).send({
          content: message.message,
          files: [attachment],
        });
      } else {
        await (<TextChannel>channel).send({
          content: message.message,
        });
      }
    }
  }
  process.exit(0);
});

client.login(process.env.F1_ALERT_DISCORD_TOKEN);
