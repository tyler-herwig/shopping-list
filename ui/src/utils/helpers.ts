export const formatDate = (utcDate: string) => {
  const date = new Date(utcDate);

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);

  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return `${dateFormatted} at ${timeFormatted}`;
};
