export function randomString(length: number) {
  return Array.from({ length })
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join("");
}
