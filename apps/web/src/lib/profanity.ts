const badWords = [
  "abuse", "spam", "badword1", "badword2", // Placeholder for actual list
];

export function isProfane(text: string): boolean {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
}
