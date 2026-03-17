type BadgeVariant = "navy" | "blue" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  navy: "bg-navy text-white",
  blue: "bg-sky-blue text-white",
  gray: "bg-light-gray text-medium-gray",
};

export function Badge({ children, variant = "navy", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
