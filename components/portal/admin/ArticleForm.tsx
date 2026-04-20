"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createArticle, updateArticle } from "@/app/actions/articles";
import type { ArticleRow, ArticleAuthor } from "@/app/actions/articles";
import type { ArticleCategory } from "@/app/generated/prisma/client";
import { ImageIcon, Loader2, Upload, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { uploadArticleImage } from "@/app/actions/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Schema ───────────────────────────────────────────────────────────────────

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: "PRICE_DATA", label: "Price Data" },
  { value: "LEGAL_GUIDES", label: "Legal Guides" },
  { value: "AREA_ANALYSIS", label: "Area Analysis" },
  { value: "FRAUD_WARNINGS", label: "Fraud Warnings" },
  { value: "HOW_TO_GUIDES", label: "How-To Guides" },
];

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only (e.g. my-article-title)",
    ),
  excerpt: z.string().min(1, "Excerpt is required"),
  publishedAt: z.string().min(1, "Date is required"),
  readTime: z.coerce
    .number()
    .int()
    .min(1, "Read time must be at least 1 minute"),
  category: z.enum([
    "PRICE_DATA",
    "LEGAL_GUIDES",
    "AREA_ANALYSIS",
    "FRAUD_WARNINGS",
    "HOW_TO_GUIDES",
  ]),
  image: z.string().min(1, "Image path is required"),
  featured: z.boolean(),
  published: z.boolean(),
  body: z.string().optional(),
});

type FormValues = z.infer<typeof articleSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  article?: ArticleRow; // undefined = create mode
  displayAuthor: ArticleAuthor;
}

export default function ArticleForm({ article, displayAuthor }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Image upload state ────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(
    article?.image || null,
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(articleSchema) as Resolver<FormValues, any, FormValues>,
    defaultValues: article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          publishedAt: toDateInputValue(article.publishedAt),
          readTime: article.readTime,
          category: article.category,
          image: article.image,
          featured: article.featured,
          published: article.published,
          body: typeof article.body === "string" ? article.body : "",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          publishedAt: new Date().toISOString().slice(0, 10),
          readTime: 5,
          category: "HOW_TO_GUIDES",
          image: "/images/hero.png",
          featured: false,
          published: true,
          body: "",
        },
  });

  async function handleImageSelect(file: File) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setImageUploadError("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Image must be under 5 MB.");
      return;
    }
    setImageUploadError(null);

    // Show a local preview immediately while uploading
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadArticleImage(fd);
    setImageUploading(false);

    if (!result.ok) {
      setImageUploadError(result.error);
      setImagePreview(form.getValues("image") || null);
      return;
    }

    form.setValue("image", result.url, { shouldValidate: true });
    setImagePreview(result.url);
  }

  function handleTitleBlur() {
    const current = form.getValues("slug");
    if (!current) {
      form.setValue("slug", slugify(form.getValues("title")));
    }
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const input = {
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt,
        publishedAt: values.publishedAt,
        readTime: values.readTime,
        category: values.category as ArticleCategory,
        image: values.image,
        featured: values.featured,
        body: values.body?.trim() || null,
        published: values.published,
      };

      if (article) {
        const result = await updateArticle(article.id, input);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Article updated.");
      } else {
        const result = await createArticle(input);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Article created.");
      }

      router.push("/admin-portal/market-intelligence");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ── Metadata card ──────────────────────────────────── */}
        <div className="rounded-2xl border border-divider bg-surface p-6 space-y-6">
          <h2 className="font-semibold text-on-surface">Article details</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="How to Buy Property in Lagos…"
                      {...field}
                      onBlur={() => {
                        field.onBlur();
                        handleTitleBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="how-to-buy-property-in-lagos"
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Used in the URL: /market-intelligence/
                    <strong>{form.watch("slug") || "your-slug"}</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description displayed in article cards and search results."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author — read-only, auto-set from current user */}
            <div className="md:col-span-2 flex items-center gap-3 rounded-xl bg-surface-alt border border-divider px-4 py-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={displayAuthor.photoUrl ?? undefined} />
                <AvatarFallback className="bg-(--color-navy-light) text-(--color-navy) text-xs font-semibold">
                  {(displayAuthor.fullName ?? displayAuthor.preferredName ?? "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface leading-snug">
                  {displayAuthor.fullName ?? displayAuthor.preferredName ?? "Unknown"}
                </p>
                <p className="text-xs text-on-surface-muted">Author · set automatically</p>
              </div>
              <UserCircle2 size={16} className="ml-auto shrink-0 text-on-surface-muted" />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published at */}
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Read time */}
            <FormField
              control={form.control}
              name="readTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Read time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={120} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cover image</FormLabel>
                  <div className="space-y-3">
                    {/* Hidden native file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file);
                        e.target.value = "";
                      }}
                    />

                    {/* Upload / preview zone */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Upload cover image"
                      onClick={() =>
                        !imageUploading && fileInputRef.current?.click()
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (!imageUploading) fileInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && !imageUploading) handleImageSelect(file);
                      }}
                      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        imagePreview
                          ? "h-52 border-divider hover:border-navy/40"
                          : "h-36 border-divider bg-surface-alt hover:border-navy/40 hover:bg-surface"
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                          />
                          {!imageUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                              <span className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-(--color-navy)">
                                <Upload size={14} />
                                Change image
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-on-surface-muted">
                          <ImageIcon size={22} />
                          <span className="text-sm font-medium">
                            Click or drag to upload
                          </span>
                          <span className="text-xs text-on-surface-muted">
                            JPEG, PNG, WebP · max 5 MB
                          </span>
                        </div>
                      )}

                      {/* Uploading overlay */}
                      {imageUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Loader2
                            size={26}
                            className="animate-spin text-white"
                          />
                        </div>
                      )}
                    </div>

                    {imageUploadError && (
                      <p className="text-xs text-red-600">{imageUploadError}</p>
                    )}

                    {/* Manual URL / path fallback */}
                    <FormControl>
                      <Input
                        placeholder="Or paste a URL / relative path (e.g. /images/hero.png)"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setImagePreview(e.target.value || null);
                          setImageUploadError(null);
                        }}
                        className="text-sm"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Checkboxes row */}
          <div className="flex flex-wrap gap-8 pt-2">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer">Featured</FormLabel>
                    <FormDescription>
                      Shown prominently as the hero article
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer">Published</FormLabel>
                    <FormDescription>
                      Visible on the public market intelligence page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ── Body card ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-divider bg-surface p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-on-surface">Article body</h2>
            <p className="text-sm text-on-surface-muted mt-1">
              Write the article content in Markdown. Leave blank to show a
              &ldquo;coming soon&rdquo; placeholder.
            </p>
          </div>

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={`## Introduction\n\nYour article content here...\n\n## Next section\n\n- List item one\n- List item two\n\n> **Note:** Use blockquotes for callouts.`}
                    rows={20}
                    className="font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Supports Markdown: # headings, **bold**, *italic*, - lists, 1.
                  numbered lists, &gt; blockquotes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin-portal/market-intelligence")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-30">
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : article ? (
              "Save changes"
            ) : (
              "Create article"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
