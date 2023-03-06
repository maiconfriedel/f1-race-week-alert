import axios from "axios";
import { translate } from "free-translate";
import moment from "moment";
import emojis from "./emojis.json";
import { formatDate } from "./utils/formatDate";

export async function getData() {
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

  if (raceData) {
    message =
      ":checkered_flag: :checkered_flag: IT'S RACE WEEK :checkered_flag: :checkered_flag:  \n\n";

    const translatedText = await translate(raceData.raceName, {
      from: "en",
      to: "pt-BR",
    });

    const emoji = emojis.find(
      (a) =>
        a.country.toLocaleLowerCase().trim() ==
        raceData.Circuit.Location.country.toLocaleLowerCase().trim()
    );

    message =
      message +
      (emoji?.emoji ?? ":checkered_flag:") +
      " " +
      translatedText +
      " " +
      (emoji?.emoji ?? ":checkered_flag:") +
      "\n\n";

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
      message = message + `**Qualificação:** Dia ${qualifyingTime}\n`;
      message = message + `**Treino Livre 2:** Dia ${freePractice2Time}\n`;
      message = message + `**Corrida Sprint:** Dia ${sprintTime}\n`;
      message = message + `**Corrida:** Dia ${raceTime}`;
    } else {
      message = message + `**Treino Livre 1:** Dia ${freePractice1Time}\n`;
      message = message + `**Treino Livre 2:** Dia ${freePractice2Time}\n`;
      message = message + `**Treino Livre 3:** Dia ${freePractice3Time}\n`;
      message = message + `**Qualificação:** Dia ${qualifyingTime}\n`;
      message = message + `**Corrida:** Dia ${raceTime}`;
    }
  }

  return message;
}
