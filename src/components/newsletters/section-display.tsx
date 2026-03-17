import type { NewsletterSection } from "@/lib/types";

interface SectionDisplayProps {
  section: NewsletterSection;
}

export function SectionDisplay({ section }: SectionDisplayProps) {
  return (
    <div>
      <h4 className="font-semibold text-navy">{section.section_title}</h4>
      {section.summary && (
        <p className="mt-1 text-sm text-medium-gray">{section.summary}</p>
      )}
      {section.section_links.length > 0 && (
        <ul className="mt-2 space-y-1">
          {section.section_links.map((link) => (
            <li key={link.id} className="flex items-center gap-2 text-sm">
              <span className="text-medium-gray">&#8226;</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-blue hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
