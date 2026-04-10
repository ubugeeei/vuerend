export const guideWhyPoints = [
  "A content-heavy commerce page can stay mostly server-rendered.",
  "Pages can be Vue SFCs while islands are JSX.",
  "`useClientState()` survives full document navigations in the same tab.",
] as const;

export const guideHomeCards = [
  {
    title: "Merchandising page shell",
    body: "The hero copy, layout, and recommendations are plain server-rendered markup. Vuerend does not assume a client router or a hydrated shell before anything can happen.",
  },
  {
    title: "Small interactive signal",
    body: "The badge below is a tiny JSX island. It is here to show that interactive pieces can stay intentionally small inside an otherwise static buying guide.",
  },
] as const;

export const shortlistWhyPoints = [
  "Teams can mix SFC-heavy pages with JSX-heavy component work.",
  "The saved shortlist is scoped to client islands, not to every route component.",
  "You still navigate between regular documents.",
] as const;

export const shortlistCards = [
  {
    title: "Shared browser state",
    body: 'The shortlist island below uses `useClientState()`. Save a few picks here, go back home, and the value stays in sync for the tab.',
  },
  {
    title: "Another tiny island",
    body: "The badge is still a separate JSX island. You can compose a page out of multiple targeted client boundaries instead of hydrating the route wholesale.",
  },
] as const;
