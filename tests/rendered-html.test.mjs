import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps requested implementation details in source", async () => {
  const [
    page,
    content,
    landing,
    hero,
    about,
    system,
    host,
    gallery,
    location,
    reservation,
    header,
    blogFeed,
    apiRoute,
    wordpressServer,
    globals,
    layout,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/BostonLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/HeroSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/AboutSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/SystemSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/HostSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/GallerySection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/LocationSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/ReservationSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/ui/SiteHeader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/sections/BlogSection.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/blog/posts/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/wordpress-server.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /BostonLanding/);
  assert.match(landing, /HeroSection/);
  assert.match(hero, /id="home"/);
  assert.match(about, /id="about"/);
  assert.match(system, /id="system"/);
  assert.match(host, /id="host"/);
  assert.match(gallery, /id="gallery"/);
  assert.match(location, /id="location"/);
  assert.match(reservation, /id="reservation"/);
  assert.match(blogFeed, /id="blog"/);
  assert.match(header, /mobile-drawer/);
  assert.match(header, /href="\/blog"/);
  assert.match(apiRoute, /fetchWordPressJson\("posts"/);
  assert.match(apiRoute, /_embed:\s*true/);
  assert.match(wordpressServer, /Authorization:\s*getAuthHeader\(\)/);
  assert.match(wordpressServer, /WP_API_URL/);
  assert.match(content, /lat:\s*37\.507081/);
  assert.match(content, /lng:\s*127\.054385/);
  assert.match(system, /system-icon/);
  assert.match(host, /\/images\/host\/444\.png/);
  assert.match(reservation, /TODO: 실제 대표자명 확정 후 교체 필요/);
  assert.match(gallery, /setLightboxIndex/);
  assert.match(globals, /\.glass-card/);
  assert.match(globals, /backdrop-filter:\s*blur\(20px\)/);
  assert.match(layout, /강남보스턴 BOSTON/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("Next production build artifacts exist", async () => {
  await access(new URL("../.next/server/app/page.js", import.meta.url));
  await access(new URL("../.next/server/app/blog/page.js", import.meta.url));
});
