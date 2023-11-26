export function joinUrl(...urls: string[]) {
  const joined = urls
    .filter(Boolean)
    .map((url) => url.replace(/(?:^\/+)|(?:\/+$)/g, ""))
    .join("/");

  return urls.length > 1 && urls[0].startsWith("/") && !joined.startsWith("/")
    ? `/${joined}`
    : joined;
}
