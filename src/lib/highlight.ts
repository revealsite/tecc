export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function getHighlightSegments(
  text: string,
  searchTerm: string
): HighlightSegment[] {
  if (!searchTerm.trim()) {
    return [{ text, highlighted: false }];
  }

  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlighted: regex.test(part) || part.toLowerCase() === searchTerm.toLowerCase(),
    }));
}
