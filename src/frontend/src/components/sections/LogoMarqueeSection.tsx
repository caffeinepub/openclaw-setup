import { PaymentMarquee } from "./PaymentMarquee";
import { WorksWithMarquee } from "./WorksWithMarquee";

export function LogoMarqueeSection() {
  return (
    <section
      id="logo-marquee"
      className="relative bg-background border-y border-border"
    >
      <PaymentMarquee />
      <WorksWithMarquee />
    </section>
  );
}
