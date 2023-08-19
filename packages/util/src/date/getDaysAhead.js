export default function getDaysAhead(days) {
  if (!Number.isInteger(days) || days <= 0) return new Date().getTime();
  const futureDate = new Date();
  return new Date(futureDate.setDate(futureDate.getDate() + days)).getTime();
}
