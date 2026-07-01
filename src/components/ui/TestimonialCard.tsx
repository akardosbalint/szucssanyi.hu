import { Quote } from "lucide-react";
import { Card } from "./Card";

export function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role?: string;
}) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <Quote className="h-7 w-7 text-accent-500" strokeWidth={1.5} />
      <p className="grow text-[15px] leading-relaxed text-primary-900">&bdquo;{quote}&rdquo;</p>
      <div>
        <p className="font-heading text-sm font-semibold text-primary-950">{name}</p>
        {role ? <p className="text-sm text-neutral-500">{role}</p> : null}
      </div>
    </Card>
  );
}
