import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function AboutStory() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionHeader
              align="left"
              eyebrow="How we started"
              title={
                <>
                  Counselling that puts{" "}
                  <span className="text-accent">facts before pressure</span>
                </>
              }
            />
            <div className="mt-6 space-y-4 font-body text-muted leading-relaxed">
              <p>
                {SITE_IDENTITY.name} grew from a need we kept hearing: NEET
                counselling and college selection should be explained calmly —
                with cut-offs, fees, and recognition laid out in plain language.
              </p>
              <p>
                We have since supported families across India, walking through
                India vs abroad trade-offs, seat timelines, and document
                readiness so choices rest on evidence, not last-minute panic.
              </p>
              <p>
                Our work today covers MBBS admissions in India and abroad, MD/MS
                pathways, and related counselling — the same measured process
                from the first enquiry through seat allotment.
              </p>
            </div>
            <Link href="/contact" className="mt-7 inline-flex">
              <Button variant="accent" className="group">
                Book a counselling call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
              <Image
                src="https://i.pinimg.com/1200x/93/10/bd/9310bd271e36a69fbfb51a782cdeda47.jpg"
                alt={`Counselling team at ${SITE_IDENTITY.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="mt-5 flex items-baseline gap-3 border-l-2 border-accent pl-4">
              <p className="font-display text-2xl font-extrabold text-accent-deep leading-none">
                15+
              </p>
              <div>
                <p className="font-display text-base font-bold text-primary">
                  Advice grounded in seat reality
                </p>
                <p className="mt-0.5 font-body text-sm text-muted">
                  Marks, budget, and location — weighed without hype
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
