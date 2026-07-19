export interface ParsedUA {
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
}

export const parseUserAgent = (ua = ""): ParsedUA => {
  const lower = ua.toLowerCase();

  const device: ParsedUA["device"] = /ipad|tablet|kindle|silk|playbook/.test(
    lower
  )
    ? "tablet"
    : /mobi|iphone|windows phone|android.*mobile/.test(lower)
      ? "mobile"
      : "desktop";

  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /chrome|crios/i.test(ua)
        ? "Chrome"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /safari/i.test(ua)
            ? "Safari"
            : "Other";

  const os = /windows/i.test(ua)
    ? "Windows"
    : /android/i.test(ua)
      ? "Android"
      : /iphone|ipad|ipod|ios/i.test(ua)
        ? "iOS"
        : /mac os|macintosh/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";

  return { device, browser, os };
};
