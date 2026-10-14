// CENTRAL PRODUCT CATALOG. Edit prices, stock, names and images here.
//
// DATA PROVENANCE
//  - name / price / brand / set / box type: taken from public listings on midwestcards.com,
//    retrieved 2026-10-09 (price field is "verified" as of that date; prices change).
//  - year / set: the year for most Pokémon and Panini rows was inferred from the product name
//    or general knowledge, NOT read from the listing. Treat as unverified and correct as needed.
//    The "Pitch Black Build & Battle Box" name was shortened/extended from the listing label
//    "Pitch Black Build & Battle".
//  - stock: PLACEHOLDER. Real inventory is unknown; set per product (0 = out of stock).
//  - image: PLACEHOLDER. No product photos were downloadable in the build environment, so
//    `image` is empty and a labelled placeholder is shown. To add a real photo, drop a file in
//    /public/products/<slug>.jpg and set image: "/products/<slug>.jpg" (use official or
//    authorised-retailer images you have permission to use), then set imageStatus: "exact".
//  - description: generic, built from the name/set/format. Only the 30th Celebration box carries
//    page-specific contents (foil Eevee card, 2 packs, plastic coin) from the reference listing.

import { slugify } from "./format";
import generatedImages from "./images.generated.json";
import extraItems from "./catalog-extras.generated.json";
import { applyExtras, type Extra } from "./catalog-merge";
import extraItems from "./catalog-extras.generated.json";
import { applyExtras, type Extra } from "./catalog-merge";

export type CategorySlug =
  | "baseball" | "basketball" | "football" | "soccer" | "hockey" | "other-sports"
  | "pokemon" | "magic" | "one-piece" | "yu-gi-oh" | "dragon-ball" | "other-tcg"
  | "memorabilia" | "apparel" | "supplies";

export const categories: { slug: CategorySlug; label: string; group: "Sports" | "Trading card games" | "More" }[] = [
  { slug: "baseball", label: "Baseball", group: "Sports" },
  { slug: "basketball", label: "Basketball", group: "Sports" },
  { slug: "football", label: "Football", group: "Sports" },
  { slug: "soccer", label: "Soccer", group: "Sports" },
  { slug: "hockey", label: "Hockey", group: "Sports" },
  { slug: "other-sports", label: "Other sports", group: "Sports" },
  { slug: "pokemon", label: "Pokémon", group: "Trading card games" },
  { slug: "magic", label: "Magic: The Gathering", group: "Trading card games" },
  { slug: "one-piece", label: "One Piece", group: "Trading card games" },
  { slug: "yu-gi-oh", label: "Yu-Gi-Oh!", group: "Trading card games" },
  { slug: "dragon-ball", label: "Dragon Ball", group: "Trading card games" },
  { slug: "other-tcg", label: "Other trading card games", group: "Trading card games" },
  { slug: "memorabilia", label: "Memorabilia", group: "More" },
  { slug: "apparel", label: "Apparel", group: "More" },
  { slug: "supplies", label: "Sleeves, binders & supplies", group: "More" },
];

// Only categories that actually contain products (used for menus, filters and tiles).
export const activeCategories = () => categories.filter((c) => products.some((p) => p.category === c.slug));

export const categoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  set: string;
  year: number;
  boxType: string;
  description: string;
  price: number; // USD dollars, e.g. 33.95
  currency: "USD";
  image: string; // "" => placeholder shown
  imageStatus: "source-photo" | "placeholder";
  gallery: string[];
  stock: number;
  availability: "in_stock" | "out_of_stock";
  featured: boolean;
  specifications: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  verification: { name: "verified"; price: "verified"; stock: "placeholder" | "verified"; image: "placeholder" | "verified" };
  source: string;
};

const SOURCE = "midwestcards.com public listing, retrieved 2026-10-09";
const DEFAULT_STOCK = 10; // PLACEHOLDER

type Row = {
  name: string; price: number; brand: string; category: CategorySlug;
  set: string; year: number; boxType: string; featured?: boolean; stock?: number;
  description?: string; specs?: Record<string, string>; stockVerified?: boolean;
};

function build(r: Row, i: number): Product {
  const slug = slugify(r.name);
  const img = (generatedImages as Record<string, string>)[slug] ?? "";
  const stock = r.stock ?? DEFAULT_STOCK;
  const description =
    r.description ??
    `${r.name} (${r.boxType.toLowerCase()}, ${r.set}, ${r.year}). Check the manufacturer's checklist for exact contents and odds before purchasing.`;
  return {
    id: `p${String(i + 1).padStart(3, "0")}`,
    slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    set: r.set,
    year: r.year,
    boxType: r.boxType,
    description,
    price: r.price,
    currency: "USD",
    image: img,
    imageStatus: img ? "source-photo" : "placeholder",
    gallery: [],
    stock,
    availability: stock > 0 ? "in_stock" : "out_of_stock",
    featured: !!r.featured,
    specifications: { Brand: r.brand, Set: r.set, Year: String(r.year), Format: r.boxType, ...(r.specs ?? {}) },
    seoTitle: `${r.name} | Harborline Cards`,
    seoDescription: `Buy ${r.name}. ${r.boxType} from ${r.set}. Order request with seller-confirmed payment.`,
    verification: { name: "verified", price: "verified", stock: r.stockVerified ? "verified" : "placeholder", image: img ? "verified" : "placeholder" },
    source: SOURCE,
  };
}

const rows: Row[] = [
    // ---------- Added Oct 2026: recent / high-demand ----------
  { name: "Pokémon Mega Evolution Perfect Order Booster Bundle Box", price: 39.95, brand: "Pokémon", category: "pokemon", set: "Perfect Order", year: 2026, boxType: "Booster Bundle Box", featured: true },
  { name: "Pokémon Mega Evolution Perfect Order Pokémon Center Elite Trainer Box", price: 159.95, brand: "Pokémon", category: "pokemon", set: "Perfect Order", year: 2026, boxType: "Elite Trainer Box" },
  { name: "Pokémon Mega Evolution Perfect Order Booster 6 Box Case", price: 1154.95, brand: "Pokémon", category: "pokemon", set: "Perfect Order", year: 2026, boxType: "Booster Case" },
  { name: "Pokémon Mega Evolution Phantasmal Flames Elite Trainer Box", price: 179.95, brand: "Pokémon", category: "pokemon", set: "Phantasmal Flames", year: 2025, boxType: "Elite Trainer Box", featured: true },
  { name: "Pokémon Mega Evolution Phantasmal Flames Booster Bundle Box", price: 109.95, brand: "Pokémon", category: "pokemon", set: "Phantasmal Flames", year: 2025, boxType: "Booster Bundle Box" },
  { name: "Pokémon Mega Evolution Phantasmal Flames Build & Battle Box", price: 58.95, brand: "Pokémon", category: "pokemon", set: "Phantasmal Flames", year: 2025, boxType: "Build & Battle Box" },
  { name: "Pokémon Mega Evolution Phantasmal Flames Sleeved Booster Pack", price: 12.95, brand: "Pokémon", category: "pokemon", set: "Phantasmal Flames", year: 2025, boxType: "Booster Pack" },
  { name: "Pokémon Mega Evolution Elite Trainer Box", price: 134.95, brand: "Pokémon", category: "pokemon", set: "Mega Evolution", year: 2025, boxType: "Elite Trainer Box", featured: true },
  { name: "2025 Panini Prizm Football Hobby Box", price: 949.95, brand: "Panini", category: "football", set: "Prizm", year: 2025, boxType: "Hobby Box", featured: true },
  { name: "2025 Panini Prizm Football Hobby Blaster Box", price: 44.95, brand: "Panini", category: "football", set: "Prizm", year: 2025, boxType: "Blaster Box" },
  { name: "2025 Panini Prizm Black Football Hobby Box", price: 629.95, brand: "Panini", category: "football", set: "Prizm Black", year: 2025, boxType: "Hobby Box" },
  { name: "2025 Panini Prizm Draft Picks Collegiate Football Hobby Box", price: 309.95, brand: "Panini", category: "football", set: "Prizm Draft Picks Collegiate", year: 2025, boxType: "Hobby Box" },
  { name: "2025/26 Topps Chrome Basketball Hobby Box", price: 1169.95, brand: "Topps", category: "basketball", set: "Topps Chrome", year: 2025, boxType: "Hobby Box", featured: true },
  { name: "2025/26 Topps Chrome Basketball Sapphire Edition Box", price: 4899.95, brand: "Topps", category: "basketball", set: "Topps Chrome Sapphire", year: 2025, boxType: "Sapphire Edition Box" },
  { name: "2025/26 Topps Chrome Update Basketball Delight Box", price: 4169.95, brand: "Topps", category: "basketball", set: "Topps Chrome Update", year: 2025, boxType: "Delight Box" },
  // ---------- Baseball ----------
  { name: "2026 Bowman Chrome Baseball Delight Box", price: 999.95, brand: "Bowman", category: "baseball", set: "Bowman Chrome", year: 2026, boxType: "Delight Box", featured: true },
  { name: "2026 Panini Prizm Baseball Hobby Box", price: 249.95, brand: "Panini", category: "baseball", set: "Prizm", year: 2026, boxType: "Hobby Box", featured: true },
  { name: "2026 Panini Prizm Baseball Hobby Blaster Box", price: 32.95, brand: "Panini", category: "baseball", set: "Prizm", year: 2026, boxType: "Blaster Box", featured: true },
  { name: "2026 Topps Chrome Baseball Hobby Box", price: 609.95, brand: "Topps", category: "baseball", set: "Topps Chrome", year: 2026, boxType: "Hobby Box" },
  { name: "2021 Bowman Chrome Baseball Hobby Box", price: 189.95, brand: "Bowman", category: "baseball", set: "Bowman Chrome", year: 2021, boxType: "Hobby Box" },
  { name: "2021 Panini Select Baseball Hobby Box", price: 174.95, brand: "Panini", category: "baseball", set: "Select", year: 2021, boxType: "Hobby Box" },
  { name: "2023 Leaf Trinity Baseball Mega Box", price: 99.95, brand: "Leaf", category: "baseball", set: "Trinity", year: 2023, boxType: "Mega Box" },
  // ---------- Basketball ----------
  { name: "2025/26 Panini Noir Basketball Hobby Box", price: 949.95, brand: "Panini", category: "basketball", set: "Noir", year: 2025, boxType: "Hobby Box", featured: true },
  { name: "2025/26 Panini Origins Basketball Hobby Box", price: 249.95, brand: "Panini", category: "basketball", set: "Origins", year: 2025, boxType: "Hobby Box" },
  // ---------- Football ----------
  { name: "2026 ONIT Signature Series University of Texas Football Platinum Box", price: 74.95, brand: "Onit Athlete", category: "football", set: "Signature Series University of Texas", year: 2026, boxType: "Platinum Box" },
  { name: "2026 Leaf Trinity Football Hobby Box", price: 199.95, brand: "Leaf", category: "football", set: "Trinity", year: 2026, boxType: "Hobby Box" },
  { name: "2023 Panini Contenders Football Hobby Box", price: 314.95, brand: "Panini", category: "football", set: "Contenders", year: 2023, boxType: "Hobby Box" },
  { name: "2024 Panini Gold Standard Football Hobby Box", price: 854.95, brand: "Panini", category: "football", set: "Gold Standard", year: 2024, boxType: "Hobby Box" },
  { name: "2023 Panini Select Football H2 Box", price: 314.95, brand: "Panini", category: "football", set: "Select", year: 2023, boxType: "H2 Box" },
  { name: "2023 Panini Select Football Hobby Box", price: 749.95, brand: "Panini", category: "football", set: "Select", year: 2023, boxType: "Hobby Box" },
  { name: "2022 Panini Prizm Football No Huddle Box", price: 399.95, brand: "Panini", category: "football", set: "Prizm", year: 2022, boxType: "No Huddle Box" },
  // ---------- Hockey ----------
  { name: "2026/27 Upper Deck Series 1 Hockey Hobby 12 Box Case", price: 1649.95, brand: "Upper Deck", category: "hockey", set: "Series 1", year: 2026, boxType: "Hobby Case" },
  { name: "2023/24 Upper Deck SPx Hockey Hobby Box", price: 119.95, brand: "Upper Deck", category: "hockey", set: "SPx", year: 2023, boxType: "Hobby Box" },
  // ---------- Other sports / entertainment ----------
  { name: "2023 Topps Chrome Formula 1 Racing Hobby Box", price: 499.95, brand: "Topps", category: "other-sports", set: "Topps Chrome Formula 1", year: 2023, boxType: "Hobby Box" },
  { name: "2025 Topps WWE Chrome Blaster Box", price: 79.95, brand: "Topps", category: "other-sports", set: "WWE Chrome", year: 2025, boxType: "Blaster Box" },
  { name: "2026 Topps Mars Attacks Christmas Hobby Pack", price: 17.95, brand: "Topps", category: "other-tcg", set: "Mars Attacks Christmas", year: 2026, boxType: "Hobby Pack" },
  // ---------- Pokémon ----------
  {
    name: "Pokémon TCG: 30th Celebration Knock Out Collection Box", price: 33.95, brand: "Pokémon", category: "pokemon",
    set: "30th Celebration", year: 2026, boxType: "Collection Box", featured: true,
    description: "Celebrate 30 years of Pokémon. Factory-sealed collection box with one foil Eevee card, two booster packs from the 30th Celebration expansion, and a plastic coin.",
    specs: { Contents: "1 foil Eevee card, 2 booster packs, 1 plastic coin", Note: "Cards-per-pack figure is inconsistent on the reference listing; confirm with Pokémon before stating it." },
  },
  { name: "Pokémon Mega Evolution Ascended Heroes Tin Box", price: 54.95, brand: "Pokémon", category: "pokemon", set: "Ascended Heroes", year: 2026, boxType: "Tin", featured: true },
  { name: "Pokémon Scarlet & Violet Paldea Evolved Booster Box", price: 549.95, brand: "Pokémon", category: "pokemon", set: "Paldea Evolved", year: 2023, boxType: "Booster Box", featured: true },
  { name: "Pokémon Scarlet & Violet Prismatic Evolutions Poster Collection Box", price: 59.95, brand: "Pokémon", category: "pokemon", set: "Prismatic Evolutions", year: 2025, boxType: "Collection Box", featured: true },
  { name: "Pokémon Sword & Shield Fusion Strike Booster Pack", price: 38.95, brand: "Pokémon", category: "pokemon", set: "Fusion Strike", year: 2021, boxType: "Booster Pack", featured: true },
  { name: "Pokémon Scarlet & Violet Paldea Evolved Checklane Blister Pack", price: 14.95, brand: "Pokémon", category: "pokemon", set: "Paldea Evolved", year: 2023, boxType: "Blister Pack" },
  { name: "Pokémon Mega Evolution Moonlit Tin 6 Box Case", price: 179.95, brand: "Pokémon", category: "pokemon", set: "Moonlit", year: 2026, boxType: "Tin Case" },
  { name: "Pokémon Scarlet & Violet 151 Ultra Premium Collection Box", price: 1224.95, brand: "Pokémon", category: "pokemon", set: "151", year: 2023, boxType: "Collection Box" },
  { name: "Pokémon Scarlet & Violet Destined Rivals Booster Box", price: 433.95, brand: "Pokémon", category: "pokemon", set: "Destined Rivals", year: 2025, boxType: "Booster Box" },
  { name: "Pokémon Scarlet & Violet Paradox Rift Booster Pack", price: 9.95, brand: "Pokémon", category: "pokemon", set: "Paradox Rift", year: 2023, boxType: "Booster Pack" },
  { name: "Pokémon Mega Evolution Chaos Rising Sleeved Booster Pack", price: 8.95, brand: "Pokémon", category: "pokemon", set: "Chaos Rising", year: 2026, boxType: "Booster Pack" },
  { name: "Pokémon Sword & Shield Silver Tempest Checklane Blister Pack", price: 15.95, brand: "Pokémon", category: "pokemon", set: "Silver Tempest", year: 2022, boxType: "Blister Pack" },
  { name: "Pokémon Mega Evolution Chaos Rising Checklane Blister Pack", price: 7.95, brand: "Pokémon", category: "pokemon", set: "Chaos Rising", year: 2026, boxType: "Blister Pack" },
  { name: "Pokémon Scarlet & Violet Surging Sparks Booster Pack", price: 10.95, brand: "Pokémon", category: "pokemon", set: "Surging Sparks", year: 2024, boxType: "Booster Pack" },
  { name: "Pokémon Sword & Shield Astral Radiance Booster Pack", price: 12.95, brand: "Pokémon", category: "pokemon", set: "Astral Radiance", year: 2022, boxType: "Booster Pack" },
  { name: "Pokémon Sword & Shield Fusion Strike Elite Trainer Box", price: 399.95, brand: "Pokémon", category: "pokemon", set: "Fusion Strike", year: 2021, boxType: "Elite Trainer Box" },
  { name: "Pokémon Scarlet & Violet Obsidian Flames Booster Pack", price: 14.95, brand: "Pokémon", category: "pokemon", set: "Obsidian Flames", year: 2023, boxType: "Booster Pack" },
  { name: "Pokémon Mega Evolution Pitch Black Elite Trainer Box", price: 74.95, brand: "Pokémon", category: "pokemon", set: "Pitch Black", year: 2026, boxType: "Elite Trainer Box" },
  { name: "Pokémon Mega Evolution Ascended Heroes Booster Bundle Box", price: 99.95, brand: "Pokémon", category: "pokemon", set: "Ascended Heroes", year: 2026, boxType: "Booster Bundle Box" },
  { name: "Pokémon Scarlet & Violet Destined Rivals Elite Trainer Box", price: 129.95, brand: "Pokémon", category: "pokemon", set: "Destined Rivals", year: 2025, boxType: "Elite Trainer Box" },
  { name: "Pokémon Sword & Shield Vivid Voltage Booster Pack", price: 9.95, brand: "Pokémon", category: "pokemon", set: "Vivid Voltage", year: 2020, boxType: "Booster Pack" },
  { name: "Pokémon Scarlet & Violet Prismatic Evolutions Super-Premium Collection Box", price: 324.95, brand: "Pokémon", category: "pokemon", set: "Prismatic Evolutions", year: 2025, boxType: "Collection Box" },
  { name: "Pokémon Mega Evolution Chaos Rising Elite Trainer Box", price: 84.95, brand: "Pokémon", category: "pokemon", set: "Chaos Rising", year: 2026, boxType: "Elite Trainer Box" },
  { name: "Pokémon Scarlet & Violet Paldea Evolved Elite Trainer Box", price: 239.95, brand: "Pokémon", category: "pokemon", set: "Paldea Evolved", year: 2023, boxType: "Elite Trainer Box" },
  { name: "Pokémon Sword & Shield Lost Origin Booster Pack", price: 28.95, brand: "Pokémon", category: "pokemon", set: "Lost Origin", year: 2022, boxType: "Booster Pack" },
  { name: "Pokémon Scarlet & Violet Prismatic Evolutions Poster Collection 6 Box Case", price: 299.95, brand: "Pokémon", category: "pokemon", set: "Prismatic Evolutions", year: 2025, boxType: "Collection Case" },
  { name: "Pokémon Mega Evolution Pitch Black Build & Battle Box", price: 74.95, brand: "Pokémon", category: "pokemon", set: "Pitch Black", year: 2026, boxType: "Build & Battle Box" },
  // ---------- Magic: The Gathering ----------
  { name: "Magic: The Gathering Reality Fracture Commander Deck 4 Deck Case", price: 224.95, brand: "Magic", category: "magic", set: "Reality Fracture", year: 2026, boxType: "Commander Deck Case" },
  { name: "Magic: The Gathering Reality Fracture Bundle Box", price: 59.95, brand: "Magic", category: "magic", set: "Reality Fracture", year: 2026, boxType: "Bundle Box" },
  { name: "Magic: The Gathering Foundations Commander Deck 5 Box Case", price: 189.95, brand: "Magic", category: "magic", set: "Foundations", year: 2026, boxType: "Commander Deck Case" },
  // ---------- Soccer (stock verified from listings on 2026-10-09) ----------
  { name: "2026 Topps MLS Chrome Soccer Hobby Box", price: 249.95, brand: "Topps", category: "soccer", set: "MLS Chrome", year: 2026, boxType: "Hobby Box", stock: 0, stockVerified: true },
  { name: "2025/26 Topps Chrome Bundesliga Soccer Hobby Box", price: 339.95, brand: "Topps", category: "soccer", set: "Chrome Bundesliga", year: 2025, boxType: "Hobby Box", stock: 1, stockVerified: true },
  { name: "2025/26 Topps UEFA Club Competitions Chrome Soccer Hobby Box", price: 369.95, brand: "Topps", category: "soccer", set: "UEFA Club Competitions Chrome", year: 2025, boxType: "Hobby Box", stock: 0, stockVerified: true },
  // ---------- Yu-Gi-Oh! ----------
  // Price conflict on the source: the product page shows $89.95 but another page quoted $99.95. Re-check.
  { name: "Yu-Gi-Oh CCG: Chaos Origins Booster Box", price: 89.95, brand: "Yu-Gi-Oh", category: "yu-gi-oh", set: "Chaos Origins", year: 2026, boxType: "Booster Box" },
  // ---------- One Piece ----------
  { name: "One Piece TCG: The World's Strongest Warriors Booster Box", price: 425.95, brand: "One Piece", category: "one-piece", set: "OP-17 The World's Strongest Warriors", year: 2026, boxType: "Booster Box", stock: 0, stockVerified: true },
  { name: "One Piece TCG: Romance Dawn Booster Box", price: 5999.95, brand: "One Piece", category: "one-piece", set: "Romance Dawn", year: 2022, boxType: "Booster Box", stock: 1, stockVerified: false },
  { name: "One Piece TCG: Premium Booster One Piece Card The Best Volume 2 Box", price: 449.95, brand: "One Piece", category: "one-piece", set: "Premium Booster PRB-02", year: 2025, boxType: "Premium Booster Box", stock: 0, stockVerified: true },
  // ---------- Dragon Ball ----------
  { name: "Dragon Ball Super TCG: Dual Evolution Booster (FB09) Box", price: 327.95, brand: "Dragon Ball Super", category: "dragon-ball", set: "Dual Evolution FB09", year: 2026, boxType: "Booster Box", stock: 0, stockVerified: true },
  { name: "Dragon Ball Super TCG: Fusion World Saiyan's Pride Booster Box", price: 229.95, brand: "Dragon Ball Super", category: "dragon-ball", set: "Fusion World Saiyan's Pride FB08", year: 2025, boxType: "Booster Box", stock: 0, stockVerified: true },
  { name: "Dragon Ball Super TCG: Fusion World Ultra Limit Booster (FB-04) Box", price: 150.95, brand: "Dragon Ball Super", category: "dragon-ball", set: "Fusion World Ultra Limit FB04", year: 2025, boxType: "Booster Box", stock: 0, stockVerified: true },
];

export const baseProducts: Product[] = rows.map(build);
export const products: Product[] = applyExtras(baseProducts, extraItems as unknown as Extra[]);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byCategory = (c: CategorySlug) => products.filter((p) => p.category === c);

export const facets = () => {
  const uniq = <T,>(a: T[]) => Array.from(new Set(a));
  return {
    brands: uniq(products.map((p) => p.brand)).sort(),
    years: uniq(products.map((p) => p.year)).sort((a, b) => b - a),
    sets: uniq(products.map((p) => p.set)).sort(),
    boxTypes: uniq(products.map((p) => p.boxType)).sort(),
  };
};
