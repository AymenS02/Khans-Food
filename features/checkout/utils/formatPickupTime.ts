export function formatPickupTime(
  time: string
) {
  const [hoursString, minutes] =
    time.split(":");

  const hours =
    Number(hoursString);

  const period =
    hours >= 12
      ? "PM"
      : "AM";

  const displayHours =
    hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
}