export interface LibraryResource {
  icon: string;
  type: string;
  title: string;
  meta: string;
  free?: boolean;
  price?: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  pdfUrl?: string;
  author?: string;
  category?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const freeResources: Omit<LibraryResource, "slug">[] = [
  {
    icon: "📜",
    type: "Manuscript",
    title: "Fetha Negest",
    meta: "Ge'ez · Legal Code · 13th c.",
    free: true,
  },
  {
    icon: "📖",
    type: "Book",
    title: "Kebra Nagast",
    meta: "Ge'ez · Epic · 14th c.",
    free: true,
  },
  {
    icon: "🎵",
    type: "Audio",
    title: "Deggua Chants Collection",
    meta: "Amharic · 4hr 20min",
    free: true,
  },
  {
    icon: "📋",
    type: "Journal",
    title: "Ethiopian Journal of Theology",
    meta: "English · Vol. 12",
    free: true,
  },
  {
    icon: "📜",
    type: "Manuscript",
    title: "Andemta Commentary",
    meta: "Ge'ez · Commentary",
    free: true,
  },
  {
    icon: "📖",
    type: "Book",
    title: "Introduction to Ge'ez Grammar",
    meta: "English · 2022",
    free: true,
  },
  {
    icon: "🎵",
    type: "Audio",
    title: "Ziema Liturgical Hymns",
    meta: "Ge'ez · 2hr 15min",
    free: true,
  },
  {
    icon: "📋",
    type: "Journal",
    title: "Theology & Digital Mission",
    meta: "English · 2023",
    free: true,
  },
];

const paidResources: Omit<LibraryResource, "slug">[] = [
  {
    icon: "📕",
    type: "Book",
    title: "Comprehensive Ge'ez Grammar",
    meta: "400 pages · PDF + Print",
    price: "$4.99",
  },
  {
    icon: "📗",
    type: "Book",
    title: "Ethiopian Church History Vol. I",
    meta: "320 pages · PDF",
    price: "$3.99",
  },
  {
    icon: "📘",
    type: "Book",
    title: "The Theology of Tabots",
    meta: "250 pages · PDF",
    price: "$4.99",
  },
  {
    icon: "📙",
    type: "Course",
    title: "Ge'ez Reading Crash Course",
    meta: "12 Lessons · Audio + PDF",
    price: "$9.99",
  },
];

export const FREE_RESOURCES: LibraryResource[] = freeResources.map(
  (resource) => ({
    ...resource,
    slug: slugify(resource.title),
  })
);

export const PAID_RESOURCES: LibraryResource[] = paidResources.map(
  (resource) => ({
    ...resource,
    slug: slugify(resource.title),
  })
);

export const LIBRARY_RESOURCES: LibraryResource[] = [
  ...FREE_RESOURCES,
  ...PAID_RESOURCES,
];

export function getResourceBySlug(slug: string) {
  return LIBRARY_RESOURCES.find((resource) => resource.slug === slug);
}
