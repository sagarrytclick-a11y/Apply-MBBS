"use client";

import { Quote, Star, ExternalLink } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./ui/SectionHeader";
import { FadeIn } from "./ui/FadeIn";
import { SITE_IDENTITY } from "@/app/config/site_identity";

interface ReviewItem {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const reviews: ReviewItem[] = [
  {
    name: "Priya Sharma",
    role: "MBBS · Kazan Federal University, Russia",
    image:
      "https://i.pinimg.com/736x/30/40/11/3040115f26d6545718e80bca3fb1fa0c.jpg",
    quote:
      "NEET options for Russia were explained without pressure. Visa and hostel steps stayed organised, and I joined my MBBS batch on schedule.",
  },
  {
    name: "Rahul Patel",
    role: "MBBS · Tbilisi State Medical University, Georgia",
    image:
      "https://i.pinimg.com/736x/37/71/4f/37714fc967378d97d443f87a0c372d39.jpg",
    quote:
      "Fee breakdowns and honest Georgia comparisons made the choice easier. Even after I reached Tbilisi, replies came when we needed them.",
  },
  {
    name: "Ananya Gupta",
    role: "MBBS · Al-Farabi Kazakh National University",
    image:
      "https://i.pinimg.com/736x/3a/15/7a/3a157a46d3ba77921779b08f5d86fae1.jpg",
    quote:
      "Document checks through airport pickup felt planned end to end. Strong choice if you are weighing Kazakhstan for MBBS.",
  },
  {
    name: "Sneha Reddy",
    role: "MBBS India · Counselling pathway",
    image:
      "https://i.pinimg.com/1200x/ec/26/16/ec261607eff327fee32c90c1d02b707c.jpg",
    quote:
      "India counselling showed which cut-offs were realistic for my score. State-wise advice helped my parents follow every round.",
  },
  {
    name: "Imran Hossain",
    role: "MBBS · Dhaka National Medical College",
    image:
      "https://i.pinimg.com/736x/dd/4b/49/dd4b49943e2466dc27df65f1128e4b61.jpg",
    quote:
      "SAARC quota rules and NMC points finally made sense. Forms and embassy steps came with a usable checklist each time.",
  },
  {
    name: "Kavya Nair",
    role: "MBBS · Bashkir State Medical University, Russia",
    image:
      "https://i.pinimg.com/736x/4f/0a/0e/4f0a0e5242c22b392f1f200d390e29b4.jpg",
    quote:
      "Admissions stayed transparent from day one. Visa arrived when expected, and the campus matched what counselling described.",
  },
  {
    name: "Arjun Singh",
    role: "MBBS · Batumi Shota Rustaveli State University",
    image:
      "https://i.pinimg.com/736x/ec/13/dc/ec13dc1935fb9fcac9bc752911ddb9d0.jpg",
    quote:
      "University comparisons stayed within our budget. Steady counselling kept my parents calmer through the entire process.",
  },
  {
    name: "Fatima Khan",
    role: "MBBS · South Kazakhstan Medical Academy",
    image:
      "https://i.pinimg.com/1200x/ad/0e/ee/ad0eee336eaa57314e59f90e95390012.jpg",
    quote:
      "From NEET discussion to flight booking, each stage had a plan. My family felt looked after the whole way.",
  },
];

const rowTop = reviews.filter((_, i) => i % 2 === 0);
const rowBottom = reviews.filter((_, i) => i % 2 === 1);

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <article className="testimonial-card flex w-[300px] shrink-0 flex-col rounded-[18px] border border-border bg-white p-5 sm:w-[340px] sm:p-6">
      <Quote className="mb-3 h-8 w-8 text-accent" strokeWidth={2.25} aria-hidden />
      <p className="font-body text-sm leading-relaxed text-text flex-1">
        {review.quote}
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-accent/30">
          <Image
            src={review.image}
            alt={review.name}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="truncate font-body text-sm font-extrabold text-primary">
            {review.name}
          </h4>
          <p className="mt-0.5 truncate font-body text-xs text-muted">{review.role}</p>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: ReviewItem[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items, ...items];

  return (
    <div className="testimonial-marquee overflow-hidden">
      <div
        className={`testimonial-marquee-track flex w-max gap-4 ${
          direction === "right"
            ? "testimonial-marquee-right"
            : "testimonial-marquee-left"
        }`}
      >
        {loop.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="he-section overflow-hidden bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Voices from families"
            title={
              <>
                Feedback from students who worked with{" "}
                <span className="text-secondary">{SITE_IDENTITY.name}</span>
              </>
            }
            description="Journeys from households that chose measured counselling for MBBS in India and abroad."
            className="mb-4"
          />
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-5 py-2.5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
                <Star className="h-3.5 w-3.5 fill-accent/40 text-accent/40" />
              </div>
              <span className="font-body text-sm font-extrabold text-primary">4.2</span>
              <span className="text-muted">·</span>
              <span className="font-body text-sm text-muted">115 reviews on Google</span>
            </div>
            <a
              href="https://www.google.com/search?q=Apply+MBBS+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[12px] bg-accent px-5 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-accent-deep"
            >
              See Google reviews
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </FadeIn>
      </div>

      <div className="testimonial-slider-wrap mx-auto max-w-[1400px] px-0 sm:px-4">
        <div className="overflow-hidden rounded-none border-y border-border bg-[#f0fdf4] py-6 sm:rounded-[28px] sm:border sm:px-2 sm:py-7">
          <div className="space-y-4">
            <MarqueeRow items={rowTop} direction="right" />
            <MarqueeRow items={rowBottom} direction="left" />
          </div>
        </div>
      </div>
    </section>
  );
}
