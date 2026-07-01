import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionVariant = "light" | "dark" | "muted";

const variantStyles: Record<SectionVariant, string> = {
  light: "bg-white text-primary-950",
  dark: "bg-primary-950 text-white",
  muted: "bg-neutral-50 text-primary-950",
};

export function Section({
  className,
  containerClassName,
  children,
  variant = "light",
  narrow = false,
  id,
}: {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  variant?: SectionVariant;
  narrow?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", variantStyles[variant], className)}>
      <Container narrow={narrow} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
