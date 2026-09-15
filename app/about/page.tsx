import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import PageHero from "@/components/ui/PageHero";
import PageCTA from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";

export default function AboutPage() {
  const phoneTel = SITE_IDENTITY.contact.phone
    .split(",")[0]
    .trim()
    .replace(/[^0-9+]/g, "");

  return (
    <div className="bg-background overflow-hidden">
      <PageHero
        surface="surface"
        eyebrow={`About ${SITE_IDENTITY.name}`}
        title={
          <>
            Practical counselling for{" "}
            <span className="text-accent">medical admissions</span>
          </>
        }
        description={`${SITE_IDENTITY.name} helps families plan MBBS and MD/MS pathways in India and abroad — realistic shortlists, fee and recognition checks, and follow-up through counselling rounds.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        image="https://i.pinimg.com/1200x/d7/b5/f9/d7b5f917245633fb0d63badd6d68b7fa.jpg"
        imageAlt={`About ${SITE_IDENTITY.name}`}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg" className="group">
              Talk to a counsellor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/colleges/mbbs-india">
            <Button variant="secondary" size="lg">
              View college options
            </Button>
          </Link>
        </div>
      </PageHero>

      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutTestimonials />

      <PageCTA
        title="Ready to plan your next counselling step?"
        description="Share your NEET score, budget, and preferred states or countries — we’ll help you compare realistic MBBS and MD/MS options."
        primaryLabel="Talk to a counsellor"
        primaryHref="/contact"
        secondaryLabel="Call now"
        secondaryHref={`tel:${phoneTel}`}
      />
    </div>
  );
}
