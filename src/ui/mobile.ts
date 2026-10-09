// Phones and tablets get the mobile layout and touch input, by user agent. iPadOS Safari says it's a Mac,
// so a Mac with a touch screen counts as a tablet.
export const MOBILE =
  /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
