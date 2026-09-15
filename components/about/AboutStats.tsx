import { Users, GraduationCap, Clock, Award, type LucideIcon } from "lucide-react";

export type AboutStat = {
  number: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
};

export const aboutStats: AboutStat[] = [
  { number: "5000+", label: "Aspirants Counselled", icon: Users },
  { number: "150+", label: "Partner Institutions", icon: GraduationCap, accent: true },
  { number: "15+", label: "Years in Counselling", icon: Clock },
  { number: "98%", label: "Would Recommend Us", icon: Award },
];

export function AboutStats({ stats = aboutStats }: { stats?: AboutStat[] }) {
  return (
    <section className="border-y border-border bg-white">
      <div className="he-container py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 lg:gap-x-0 lg:divide-x lg:divide-border">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center lg:px-6"
            >
              <stat.icon
                className={`mb-2.5 h-4 w-4 ${
                  stat.accent ? "text-accent" : "text-accent-deep/70"
                }`}
              />
              <p
                className={`font-display text-3xl sm:text-4xl font-extrabold leading-none tracking-tight ${
                  stat.accent ? "text-accent" : "text-primary"
                }`}
              >
                {stat.number}
              </p>
              <p className="mt-2 font-body text-xs sm:text-sm font-semibold text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
