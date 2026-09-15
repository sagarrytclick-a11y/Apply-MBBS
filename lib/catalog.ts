import mbbsIndia from "../public/mbbs-india.json";
import mbbsAbroad from "../public/mbbs-abroad.json";
import mdMs from "../public/md-ms.json";
import blogsData from "../public/blogs.json";
import { dailySeed, shuffle } from "./shuffle";

export function toCollegeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toCountrySlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export type CatalogCollege = {
  id: number;
  name: string;
  city: string;
  fees?: string;
  seats?: number;
  recognition?: string;
  ranking?: string;
  type?: string;
  image?: string;
  description?: string;
  region: string;
  pathway: "india" | "abroad" | "mdms";
  parentSlug?: string;
};

export function getAbroadCountries() {
  return (mbbsAbroad.countries || []).map((c) => ({
    name: c.name,
    slug: toCountrySlug(c.name),
    image: "image" in c ? c.image : undefined,
    description: "description" in c ? c.description : undefined,
    collegeCount: c.colleges?.length || 0,
  }));
}

export function getCountryBySlug(slug: string) {
  return getAbroadCountries().find((c) => c.slug === slug) || null;
}

export function getAllColleges(): CatalogCollege[] {
  const list: CatalogCollege[] = [];

  for (const state of mbbsIndia.states || []) {
    for (const c of state.colleges || []) {
      list.push({
        id: c.id,
        name: c.name,
        city: c.city,
        fees: "fees" in c ? String(c.fees) : undefined,
        seats: "seats" in c && typeof c.seats === "number" ? c.seats : undefined,
        recognition: "recognition" in c ? String(c.recognition) : undefined,
        ranking: "ranking" in c ? String(c.ranking) : undefined,
        type: "type" in c ? String(c.type) : undefined,
        image: "image" in c ? String(c.image) : undefined,
        region: state.name,
        pathway: "india",
      });
    }
  }

  for (const country of mbbsAbroad.countries || []) {
    for (const c of country.colleges || []) {
      list.push({
        id: c.id,
        name: c.name,
        city: c.city,
        fees: "fees" in c ? String(c.fees) : undefined,
        recognition: "recognition" in c ? String(c.recognition) : undefined,
        ranking: "ranking" in c ? String(c.ranking) : undefined,
        type: "type" in c ? String(c.type) : undefined,
        image: "image" in c ? String(c.image) : undefined,
        region: country.name,
        pathway: "abroad",
      });
    }
  }

  for (const state of mdMs.states || []) {
    for (const c of state.colleges || []) {
      list.push({
        id: c.id,
        name: c.name,
        city: c.city,
        fees: "fees" in c ? String(c.fees) : undefined,
        seats: "seats" in c && typeof c.seats === "number" ? c.seats : undefined,
        recognition: "recognition" in c ? String(c.recognition) : undefined,
        ranking: "ranking" in c ? String(c.ranking) : undefined,
        type: "type" in c ? String(c.type) : undefined,
        image: "image" in c ? String(c.image) : undefined,
        region: state.name,
        pathway: "mdms",
        parentSlug: state.slug,
      });
    }
  }

  return shuffle(list, dailySeed() + 7);
}

export function getCollegeBySlug(slug: string) {
  return getAllColleges().find((c) => toCollegeSlug(c.name) === slug) || null;
}

export function getMdMsStates() {
  return (mdMs.states || []).map((s) => ({
    name: s.name,
    slug: s.slug,
    image: "image" in s ? String(s.image) : undefined,
    description: "description" in s ? String(s.description) : undefined,
    collegeCount: s.colleges?.length || 0,
  }));
}

export function getMdMsStateBySlug(slug: string) {
  return getMdMsStates().find((s) => s.slug === slug) || null;
}

export function getBlogs() {
  return (blogsData.blogs || []).map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    image: b.image,
    category: b.category,
    author: b.author,
    date: b.date,
    readTime: b.readTime,
    tags: b.tags,
    content: "content" in b ? String(b.content) : undefined,
  }));
}

export function getBlogById(id: number) {
  return getBlogs().find((b) => b.id === id) || null;
}
