import { getHighlightSegments } from "@/lib/highlight";

interface HighlightTextProps {
  text: string;
  searchTerm?: string;
}

export function HighlightText({ text, searchTerm }: HighlightTextProps) {
  if (!searchTerm?.trim()) {
    return <>{text}</>;
  }

  const segments = getHighlightSegments(text, searchTerm);

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark key={i} className="bg-yellow-200 text-inherit rounded-sm px-0.5">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}
