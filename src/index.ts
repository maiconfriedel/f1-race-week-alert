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
  const race = await getRacesData();

  const channelsIds = ["1082389835249111070"];

  for (let index = 0; index < channelsIds.length; index++) {
    if (race.message) {
      const channel = (await client.channels.fetch(
        channelsIds.at(index)
      )) as TextChannel;

      if (race.image_url) {
        const attachment = new AttachmentBuilder(race.image_url);

        await channel.send({
          content: race.message,
          files: [attachment],
        });
      } else {
        await channel.send({
          content: race.message,
        });
      }
    }
  }
  process.exit(0);
});

client.login(process.env.F1_ALERT_DISCORD_TOKEN);
