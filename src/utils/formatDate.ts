import moment from "moment";

export function formatDate(date: string) {
  return moment(date, "yyyy-MM-DD hh:mm:ss'Z'").format("DD/MM/yyyy [as] HH:mm");
}
