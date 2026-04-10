export interface ReleaseNote {
  slug: string;
  summary: string;
  title: string;
}

export const releaseNotes = {
  hello: {
    slug: "hello",
    summary:
      "Release notes front pages often need one fresh snapshot while long-tail entries stay static.",
    title: "Fresh enough for a release notes home",
  },
  world: {
    slug: "world",
    summary:
      "A long-tail entry can be prerendered once and still fit into a newsroom with frequent homepage updates.",
    title: "Static entries, changing front page",
  },
} as const satisfies Record<string, ReleaseNote>;

export const releaseNoteList = Object.values(releaseNotes);
