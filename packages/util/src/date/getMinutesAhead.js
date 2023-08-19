export default function getMinutesAhead(min) {
  const today = new Date();
  return new Date(today.setMinutes(today.getMinutes() + min)).getTime();
}
