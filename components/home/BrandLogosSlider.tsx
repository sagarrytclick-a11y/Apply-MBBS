"use client";

import { useMemo } from "react";
import Image from "next/image";
import { dailySeed, shuffle } from "@/lib/shuffle";

const logos = [
  { src: "https://img.collegedunia.com/public/college_data/images/logos/AIIMS%20MBBS.png", alt: "AIIMS Delhi" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJVQgGQ3jtqsT5xP9DPAN8plhZtOCvfo7cosJf8NL8Tg&s=10", alt: "MAMC Delhi" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmT0Jx9sFJGvbrJb8jLh-gY5CEZTBhT-Buiq2RNv41Lw&s=10", alt: "LHMC Delhi" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGXfP2Ac2z4XooigfB8hWT3vaYfTjsEIaDRSeRHy5i5w&s=10", alt: "UCMS Delhi" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhy6B7AskZsqoTxrqXfmL6ZK64tZGSizCd3G5ZG4X7bw&s=10", alt: "VMMC Delhi" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5gbDymt3jPkFNtAinHej_ttix5SSrFy4VFB7wQKtaPQ&s=10", alt: "Army College of Medical Sciences" },
  { src: "https://media.licdn.com/dms/image/v2/D4D03AQGY2P-FwGTSBA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1677318866870?e=2147483647&v=beta&t=bWIfEal7Zubc5CTlIOUiXPWCdtPfEiKk8gCvhWBIKD8", alt: "KMC Manipal" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQONrYu59ryhuyhGOsZpxAOUaqdCrYjxInCgk5RaxCFug&s=10", alt: "MAHE Manipal" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm1iPl4RshF9wQmUJTjfzNt_zaVBc4WIXwHC4qnD8d1w&s=10", alt: "PGIMS Rohtak" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67vNySklSMM_mn-LS1WzNFq8SvI28PM6uHwADeJ3Ovw&s=10", alt: "SMS Jaipur" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRSjroZcGEVGelfeBhOnIDCeG9h0KJiEJDDAXPzmFmDg&s=10", alt: "GMC Nagpur" },
  { src: "https://lh6.googleusercontent.com/proxy/ZUN5tBlC-MPwP9j481pfUboa4YQhM321StcDrJDBZy6YSSjL2v_MvBxUrxlm4F23PH55WWcnFzDu6LiALWtzjxc", alt: "BJMC Pune" },
];

export default function BrandLogosSlider() {
  const loop = useMemo(() => {
    const shuffled = shuffle(logos, dailySeed() + 53);
    return [...shuffled, ...shuffled];
  }, []);

  return (
    <section className="relative z-0 border-y border-border bg-white">
      <div className="he-container py-3 sm:py-4">
        <p className="mb-3 text-center font-body text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          Colleges aspirants compare often
        </p>

        <div className="brand-logos relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(to_right,#fff_0%,transparent_100%)] sm:w-28"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(to_left,#fff_0%,transparent_100%)] sm:w-28"
          />

          <div className="brand-logos-track flex w-max items-center py-2">
            {loop.map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="relative mx-8 flex h-[72px] w-[140px] shrink-0 items-center justify-center sm:mx-12 sm:h-[88px] sm:w-[170px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={190}
                  height={100}
                  className="h-full w-auto max-h-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
