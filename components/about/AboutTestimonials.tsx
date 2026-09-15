import Image from "next/image";
import { Quote } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import SectionHeader from "@/components/ui/SectionHeader";

export type AboutTestimonial = {
  name: string;
  course: string;
  quote: string;
  rating: number;
  image: string;
};

export const aboutTestimonials: AboutTestimonial[] = [
  {
    name: "Meera Joshi",
    course: "MBBS · Government College, Rajasthan",
    quote: `We were stuck on India versus abroad. ${SITE_IDENTITY.name} broke down cut-offs, fee ranges, and counselling timelines — options without sales pressure.`,
    rating: 5,
    image:
      "https://i.pinimg.com/736x/92/f0/7a/92f07a26ddbf9325016a46e7bed4865a.jpg",
  },
  {
    name: "Arjun Desai",
    course: "MBBS · Georgia",
    quote:
      "University shortlisting through visa steps stayed organised. My parents could track each stage and felt secure about studying medicine overseas.",
    rating: 5,
    image:
      "https://i.pinimg.com/1200x/00/3c/14/003c1498ac8ce504221aca9a143895df.jpg",
  },
  {
    name: "Sana Fatima",
    course: "MBBS · Private Medical College, Karnataka",
    quote:
      "They walked me through document checklists and counselling rounds. The shortlist matched my NEET marks and what our family could afford.",
    rating: 5,
    image:
      "https://i.pinimg.com/736x/47/84/e9/4784e97d99d60fbbc4723864e3f57281.jpg",
  },
];

export function AboutTestimonials({
  items = aboutTestimonials,
}: {
  items?: AboutTestimonial[];
}) {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <SectionHeader
          align="left"
          eyebrow="From our students"
          title={
            <>
              Feedback after{" "}
              <span className="text-accent">admission planning</span>
            </>
          }
          description={`Experiences with ${SITE_IDENTITY.name} — domestic seats and overseas MBBS.`}
          className="mb-10"
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {items.map((t) => (
            <blockquote key={t.name} className="flex h-full flex-col">
              <Quote className="mb-3 h-6 w-6 text-accent/40" aria-hidden />
              <p className="flex-1 font-body text-[15px] leading-relaxed text-primary">
                “{t.quote}”
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div>
                  <cite className="not-italic font-body text-sm font-bold text-text">
                    {t.name}
                  </cite>
                  <p className="mt-0.5 font-body text-xs text-muted">{t.course}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
