// Settings are each kept in a cookie for a year. Cookies can be blocked too (sandboxed frames): a read
// then finds nothing, and a write is skipped, so the choice still applies for this visit.
export const readCookie = (name: string) => {
  try {
    return document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  } catch {
    return undefined;
  }
};
export const writeCookie = (name: string, value: string) => {
  try {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Not saved.
  }
};
