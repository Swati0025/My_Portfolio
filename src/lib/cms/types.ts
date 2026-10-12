export const contentTypes = ["story", "poem", "article", "review"] as const;
export type ContentType = (typeof contentTypes)[number];
export type PublishStatus = "draft" | "published";

export type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  status: PublishStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type WriterProfile = {
  id: boolean;
  display_name: string;
  biography: string;
  profile_image: string | null;
  email: string | null;
  social_links: Record<string, string>;
  updated_at: string;
};

export function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

export function contentPath(type: ContentType, slug: string) {
  const section = contentCollectionPath(type);
  return `/${section}/${slug}`;
}

export function contentCollectionPath(type: ContentType) {
  return type === "story" ? "stories" : type === "poem" ? "poems" : type === "review" ? "book-reviews" : "articles";
}

export function contentLabel(type: ContentType) {
  return type === "story" ? "Stories" : type === "poem" ? "Poems" : type === "review" ? "Book Reviews" : "Articles";
}

export function contentSingularLabel(type: ContentType) {
  return type === "story" ? "Story" : type === "poem" ? "Poem" : type === "review" ? "Book Review" : "Article";
}
