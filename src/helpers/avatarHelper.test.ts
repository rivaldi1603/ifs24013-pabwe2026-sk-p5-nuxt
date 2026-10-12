import { describe, it, expect } from "vitest";
import { getAvatarUrl, getFallbackAvatar, getUserDisplayName } from "./avatarHelper";

describe("avatarHelper", () => {
  it("getUserDisplayName picks the first available field", () => {
    expect(getUserDisplayName({ name: "A" })).toBe("A");
    expect(getUserDisplayName({ full_name: "B" })).toBe("B");
    expect(getUserDisplayName({ username: "c" })).toBe("c");
    expect(getUserDisplayName(null)).toBe("User");
  });

  it("getFallbackAvatar returns svg data uri with initials", () => {
    const uri = getFallbackAvatar({ name: "John Doe" });
    expect(uri.startsWith("data:image/svg+xml")).toBe(true);
    expect(decodeURIComponent(uri)).toContain(">JD<");
    expect(decodeURIComponent(getFallbackAvatar({ name: "   " }))).toContain(">U<");
  });

  it("getAvatarUrl uses http photo or falls back", () => {
    expect(getAvatarUrl({ photo: "https://x/a.png" })).toBe("https://x/a.png");
    expect(getAvatarUrl({ avatar: "https://x/b.png" })).toBe("https://x/b.png");
    expect(getAvatarUrl({ avatar_url: "https://x/c.png" })).toBe("https://x/c.png");
    expect(getAvatarUrl({ photo: "/local.png", name: "Z" })).toContain("data:image/svg+xml");
    expect(getAvatarUrl({ photo: 123 })).toContain("data:image/svg+xml");
    expect(getAvatarUrl(undefined)).toContain("data:image/svg+xml");
  });
});
