export const launchWeekStory = {
  eyebrow: "Publisher workflow",
  summary:
    "Marketing teams need shareable visuals for launch notes, keynote recaps, and feature stories without leaving the Vue authoring model.",
  title: "Author social cards as Vue SFCs, then render them through Chromium.",
} as const;

export const socialCardTemplate = {
  description:
    "Launch notes, keynote recaps, and editorial announcements can share the same Vue authoring surface.",
  eyebrow: launchWeekStory.eyebrow,
  title: "Social Cards Studio",
} as const;
