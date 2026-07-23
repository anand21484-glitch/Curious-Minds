// Placeholder sample content for day-of-year rotation logic.
// Replace with the full scientist/story dataset described in design/Curious Minds.dc.html.

export const featuredStories = [
  { id: 'ramanujan', title: 'The Curious Minds of Ancient India' },
  { id: 'kalam', title: 'Nobel Prize Winning Scientists from India' },
  { id: 'raman', title: 'The Man Who Bent Light' },
];

export const dailyFacts = [
  'C.V. Raman discovered how light scatters in liquids, winning India its first Nobel Prize in Physics.',
  "Srinivasa Ramanujan had almost no formal training yet produced thousands of original mathematical results.",
  'Kalpana Chawla was the first woman of Indian origin to go to space.',
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function storyOfTheDay(date: Date = new Date()) {
  return featuredStories[dayOfYear(date) % featuredStories.length];
}

export function factOfTheDay(date: Date = new Date()) {
  return dailyFacts[dayOfYear(date) % dailyFacts.length];
}
