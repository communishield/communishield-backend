export function joinUrl(...urls: string[]) {
  const joined = urls
    .map((url) => url.replace(/(?:^\/+)|(?:\/+$)/g, ""))
    .filter(Boolean)
    .join("/");

  return urls.length > 1 && urls[0].startsWith("/") && !joined.startsWith("/")
    ? `/${joined}`
    : joined;
}
