import axios from "axios";
import moment from "moment";
import races from "./races.json";
import { formatDate } from "./utils/formatDate";

export async function getRacesData(): Promise<{
  message: string;
  image_url: string;
}> {
  const endOfWeek = moment(new Date())
    .endOf("week")
    .add(1, "day")
    .format("yyyy-MM-DD");

  const currentYear = new Date().getFullYear();

  const response = await axios.get(
    `http://ergast.com/api/f1/${currentYear}.json`
  );

  const raceData = response.data.MRData.RaceTable.Races.find(
    (a: any) => a.date == endOfWeek
  );

  let message = "";
  let image_url = "";

  if (raceData) {
    message =
      "@here :checkered_flag: :checkered_flag: IT'S RACE WEEK :checkered_flag: :checkered_flag:  \n\n";

    const race = races.find(
      (a) =>
        a.raceName.toLocaleLowerCase().trim() ==
        raceData.raceName.toLocaleLowerCase().trim()
    );

    image_url = race?.image_url;

    message =
      message +
      (race?.flag_emoji ?? ":checkered_flag:") +
      " " +
      raceData.raceName +
      " " +
      (race?.flag_emoji ?? ":checkered_flag:") +
      "\n";

    message =
      message + `:motorway: ${raceData.Circuit.circuitName} :motorway: \n\n`;

    const raceTime = formatDate(raceData.date + raceData.time);

    const freePractice1Time = formatDate(
      raceData.FirstPractice.date + raceData.FirstPractice.time
    );

    const freePractice2Time = formatDate(
      raceData.SecondPractice.date + raceData.SecondPractice.time
    );

    let freePractice3Time = "";
    if (raceData.ThirdPractice) {
      freePractice3Time = formatDate(
        raceData.ThirdPractice.date + raceData.ThirdPractice.time
      );
    }

    let sprintTime = "";
    if (raceData.Sprint) {
      sprintTime = formatDate(raceData.Sprint.date + raceData.Sprint.time);
    }

    const qualifyingTime = formatDate(
      raceData.Qualifying.date + raceData.Qualifying.time
    );

    if (sprintTime) {
      message = message + `**Treino Livre 1:** Dia ${freePractice1Time}\n`;
      message = message + `**Qualificação:** Dia ${freePractice2Time}\n`;
      message = message + `**Qualificação Sprint:** Dia ${sprintTime}\n`;
      message = message + `**Corrida Sprint:** Dia ${qualifyingTime}\n`;
      message = message + `**Corrida:** Dia ${raceTime}`;
    } else {
      message = message + `**Treino Livre 1:** Dia ${freePractice1Time}\n`;
      message = message + `**Treino Livre 2:** Dia ${freePractice2Time}\n`;
      message = message + `**Treino Livre 3:** Dia ${freePractice3Time}\n`;
      message = message + `**Qualificação:** Dia ${qualifyingTime}\n`;
      message = message + `**Corrida:** Dia ${raceTime}`;
    }
  }

  return { message, image_url };
}
