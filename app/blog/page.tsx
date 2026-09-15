"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageCTA from "@/components/ui/PageCTA";
import { Pagination } from "@/components/ui/Pagination";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/blogs.json");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = useMemo(
    () => ["all", ...new Set(blogs.map((b) => b.category))],
    [blogs]
  );

  const tags = useMemo(
    () => ["all", ...new Set(blogs.flatMap((b) => b.tags))],
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        blog.title.toLowerCase().includes(q) ||
        blog.description.toLowerCase().includes(q) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;
      const matchesTag =
        selectedTag === "all" || blog.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogs, searchTerm, selectedCategory, selectedTag]);

  const pages = Math.ceil(filteredBlogs.length / blogsPerPage) || 1;
  const pageItems = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedTag !== "all";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-white">
        <div className="he-container py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-3">
              Blog
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-primary leading-tight tracking-tight">
              Admission notes & explainers
            </h1>
            <p className="mt-4 font-body text-base text-muted leading-relaxed">
              Practical reads on NEET, counselling, and college choices — for
              students and parents planning MBBS or MD/MS.
            </p>
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          {loading ? (
            <div className="mb-10 space-y-4 animate-pulse">
              <div className="h-11 max-w-md rounded-[12px] border border-border bg-white" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-24 rounded-full border border-border bg-white"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-10 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search by topic or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-[12px] border border-border bg-white pl-10 pr-4 font-body text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="h-11 rounded-[12px] border border-border bg-white px-3.5 font-body text-sm text-primary outline-none focus:border-accent"
                    aria-label="Filter by tag"
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all" ? "Every tag" : tag}
                      </option>
                    ))}
                  </select>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="font-body text-sm font-semibold text-accent-deep hover:text-accent whitespace-nowrap"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full border px-3.5 py-1.5 font-body text-[13px] font-semibold transition-colors ${
                        active
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-white text-muted hover:border-accent/40 hover:text-accent-deep"
                      }`}
                    >
                      {category === "all" ? "Everything" : category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between gap-4">
            {loading ? (
              <div className="h-4 w-28 animate-pulse rounded bg-border/70" />
            ) : (
              <>
                <p className="font-body text-sm font-semibold text-muted">
                  {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "article" : "articles"} matched
                </p>
                {pages > 1 && (
                  <p className="font-body text-sm text-muted">
                    Page {currentPage} of {pages}
                  </p>
                )}
              </>
            )}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-white animate-pulse"
                >
                  <div className="aspect-[16/10] bg-border/60" />
                  <div className="flex flex-1 flex-col space-y-3 p-5">
                    <div className="h-5 w-20 rounded-full bg-border/70" />
                    <div className="h-5 w-full rounded bg-border/80" />
                    <div className="h-5 w-4/5 rounded bg-border/70" />
                    <div className="h-3.5 w-full rounded bg-border/50" />
                    <div className="mt-auto h-4 w-28 rounded bg-border/60 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : pageItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-colors hover:border-accent/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    <Image
                      src={blog.image || "/medical.webp"}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="inline-flex w-fit rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wide text-accent-deep">
                      {blog.category}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug text-primary line-clamp-3 transition-colors group-hover:text-accent-deep">
                      {blog.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[12px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-accent" />
                          {blog.date}
                        </span>
                        {blog.readTime ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-accent" />
                            {blog.readTime}
                          </span>
                        ) : null}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 font-body text-sm font-bold text-accent-deep">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[16px] border border-border bg-white px-6 py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-border" />
              <h3 className="mb-2 font-display text-2xl font-extrabold text-primary">
                Nothing matched
              </h3>
              <p className="mb-6 font-body text-muted">
                Adjust your search or remove the active filters.
              </p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          )}

          {!loading && (
            <Pagination
              className="mt-12"
              currentPage={currentPage}
              totalPages={pages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 280, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </section>

      {!loading && (
        <PageCTA
          title="Planning a college shortlist?"
          description="Talk to a counsellor — we’ll align options with your NEET score, category, and budget."
          primaryLabel="Talk to a counsellor"
          primaryHref="/contact"
          secondaryLabel="Explore colleges"
          secondaryHref="/colleges/mbbs-india"
        />
      )}
    </div>
  );
};

export default BlogPage;
