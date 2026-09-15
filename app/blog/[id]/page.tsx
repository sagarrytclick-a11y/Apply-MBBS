"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Link2,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BlogDetailSkeleton } from "@/components/ui/Skeleton";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string;
  overlayText: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content?: string;
}

const BlogPostPage: React.FC = () => {
  const params = useParams();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0 && params.id) {
      const blogId = parseInt(params.id as string);
      const foundBlog = blogs.find((b) => b.id === blogId);

      if (foundBlog) {
        setBlog(foundBlog);
      }

      setLoading(false);
    }
  }, [blogs, params.id]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/blogs.json");
      const data = await response.json();

      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getRelatedBlogs = () => {
    if (!blog) return [];

    return blogs
      .filter(
        (b) =>
          b.id !== blog.id &&
          (b.category === blog.category ||
            b.tags.some((tag) => blog.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-[16px] border border-border bg-white p-10 text-center">
          <h1 className="mb-4 font-display text-3xl font-extrabold text-primary">
            Article unavailable
          </h1>
          <p className="mb-8 font-body text-muted">
            This post may have been removed or the link is incorrect.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4" />
              Return to blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedBlogs = getRelatedBlogs();
  const titleCrumb =
    blog.title.length > 42 ? `${blog.title.slice(0, 42)}…` : blog.title;

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-white">
        <div className="he-container py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 font-body text-[13px] text-muted"
          >
            <Link href="/" className="hover:text-accent-deep transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <Link
              href="/blog"
              className="hover:text-accent-deep transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="text-primary font-medium line-clamp-1">
              {titleCrumb}
            </span>
          </nav>

          <div className="max-w-3xl text-left">
            <span className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-accent-deep">
              {blog.category}
            </span>

            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight tracking-tight text-primary text-left">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                  {blog.author.charAt(0)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-accent" />
                  {blog.author}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                {blog.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {blog.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container max-w-3xl">
          <div className="relative mb-10 h-56 overflow-hidden rounded-[16px] border border-border bg-white sm:h-72 lg:h-80">
            <Image
              src={blog.image || "/medical.webp"}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <article className="rounded-[16px] border border-border bg-white">
            <div className="border-b border-border px-6 py-6 sm:px-8 sm:py-8">
              <p className="font-body text-lg leading-relaxed text-muted">
                {blog.description}
              </p>
            </div>

            {blog.content && (
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="whitespace-pre-line font-body text-base leading-relaxed text-primary/85 md:text-lg">
                  {blog.content}
                </div>
              </div>
            )}

            {blog.tags.length > 0 && (
              <div className="border-t border-border px-6 py-6 sm:px-8 sm:py-8">
                <h3 className="mb-4 flex items-center gap-3 font-display text-lg font-extrabold text-primary">
                  <span className="h-1 w-7 rounded-full bg-accent" />
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-background px-3.5 py-1.5 font-body text-xs font-semibold text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <div className="mt-6 flex flex-col gap-4 rounded-[16px] border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-display text-lg font-extrabold text-primary">
                Pass this along
              </h3>
              <p className="mt-1 font-body text-sm text-muted">
                Copy the URL to send to a student, parent, or counsellor.
              </p>
            </div>
            <Button onClick={handleCopy} variant="accent" className="shrink-0">
              <Link2 className="h-4 w-4" />
              {copied ? "Link copied" : "Copy URL"}
            </Button>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-14">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-1">
                    More to read
                  </p>
                  <h2 className="font-display text-2xl font-extrabold text-primary">
                    Related posts
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-accent-deep hover:text-accent transition-colors"
                >
                  Browse all articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    href={`/blog/${relatedBlog.id}`}
                    key={relatedBlog.id}
                    className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-colors hover:border-accent/50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-background">
                      <Image
                        src={relatedBlog.image || "/medical.webp"}
                        alt={relatedBlog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="inline-flex w-fit rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-accent-deep">
                        {relatedBlog.category}
                      </span>
                      <h3 className="mt-2.5 font-display text-base font-bold leading-snug text-primary line-clamp-2 group-hover:text-accent-deep transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-3 pt-3 font-body text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-accent" />
                          {relatedBlog.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-accent" />
                          {relatedBlog.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
