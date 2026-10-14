const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export const getUserDisplayName = (user: any): string =>
  user?.name || user?.full_name || user?.username || "User";

/**
 * Builds a local SVG avatar (data URI). No network request, so no third-party
 * cookies, no console errors, and it stays sharp at any device pixel ratio.
 */
export const getFallbackAvatar = (user: any): string => {
  const name = String(getUserDisplayName(user)).trim();
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("") || "U";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.codePointAt(i)!) >>> 0;
  const bg = COLORS[hash % COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="${bg}"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="52" font-weight="600" fill="#fff">${initials.replaceAll(/[<>&"']/g, "")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const getAvatarUrl = (user: any): string => {
  const url = user?.photo || user?.avatar || user?.avatar_url;
  if (!url || typeof url !== "string" || !url.startsWith("http")) return getFallbackAvatar(user);
  return url;
};
