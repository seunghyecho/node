const session = {};

const cookie = parseCookies(req.headers.cookie);
if (req.url.startsWith("/login")) {
  const { query } = url.parse(req.url);
}
