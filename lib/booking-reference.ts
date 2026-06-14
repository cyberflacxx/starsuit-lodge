export function generateBookingReference(date = new Date()) {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let index = 0; index < 6; index += 1) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }

  return `STL-${datePart}-${randomPart}`;
}
