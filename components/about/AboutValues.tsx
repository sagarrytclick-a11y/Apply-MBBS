import { CheckCircle2, Target, Eye, Compass, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const values: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Equip NEET aspirants with straight answers on colleges, fees, and counselling — so admission decisions feel deliberate, not rushed.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "Remain the steady counselling desk families rely on for medical admissions in India and abroad, known for clarity and follow-through.",
  },
  {
    icon: Compass,
    title: "Our Approach",
    desc: "Start with your profile, then shortlist. We align score, budget, and preference — and stay available until the seat is confirmed.",
  },
];

const achievements = [
  "NEET UG & PG counselling help",
  "India and abroad college maps",
  "Fee structure & recognition checks",
  "Form filling & document reviews",
  "Visa and travel coordination",
  "Support after seat allotment",
];

export function AboutValues() {
  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <SectionHeader
          align="left"
          eyebrow="What guides us"
          title="Mission, vision & method"
          description="The standards we apply to every shortlist, counselling call, and paperwork review."
          className="mb-10"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="border-l-2 border-accent pl-5"
              >
                <Icon className="h-5 w-5 text-accent-deep" />
                <h3 className="mt-3 font-display text-xl font-extrabold text-primary">
                  {v.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
          {achievements.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span className="font-body text-sm font-semibold text-text">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
