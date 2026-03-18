interface CardProps {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function Card({ children, accent = false, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white shadow-sm border border-border hover:shadow-md transition-shadow ${
        accent ? "border-l-4 border-l-navy" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
