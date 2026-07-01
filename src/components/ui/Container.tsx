import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  narrow = false,
}: {
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
