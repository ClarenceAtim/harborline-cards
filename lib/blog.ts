// Blog posts live here. To add a post, copy one block inside `posts`, change the text, and push.
// date format: YYYY-MM-DD. slug: lowercase words joined by dashes (it becomes the page address).

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string; // shown in Google results and on the blog list, about 150 characters
  date: string;
  shopLink: { label: string; href: string };
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "hobby-box-vs-blaster-box",
    title: "Hobby Box vs Blaster Box: What Is the Difference?",
    description:
      "Hobby boxes and blaster boxes both hold sealed trading cards, but they are built for different collectors. Here is how they differ and which one to pick.",
    date: "2026-10-15",
    shopLink: { label: "Browse sealed boxes", href: "/shop" },
    body: [
      {
        type: "p",
        text: "If you are new to sealed trading cards, the names can be confusing. Hobby boxes, blaster boxes, hanger boxes and value packs all sit on shelves next to each other, yet they are made for different buyers. Here is a simple way to tell them apart.",
      },
      { type: "h2", text: "What is a hobby box?" },
      {
        type: "p",
        text: "A hobby box is the version made mainly for hobby shops and serious collectors. Manufacturers usually put more premium cards in these boxes, and many promise a set number of special cards such as autographs or memorabilia cards. The price is higher, but so is the chance of the cards collectors are really chasing.",
      },
      { type: "h2", text: "What is a blaster box?" },
      {
        type: "p",
        text: "A blaster box is the lower-priced version sold in large retail stores. It holds fewer packs and costs less. The odds of the top cards are usually lower than in a hobby box, and some blaster boxes include exclusive cards that you will not find in the hobby version.",
      },
      { type: "h2", text: "Which one should you buy?" },
      {
        type: "ul",
        items: [
          "Buy a blaster if you want a low-cost way to enjoy opening packs, or you are buying for a gift or a young collector.",
          "Buy a hobby box if you want better odds at premium cards and you are comfortable spending more.",
          "Check the product description each time. Contents, odds and guaranteed cards change from set to set and from year to year.",
        ],
      },
      { type: "h2", text: "A quick tip" },
      {
        type: "p",
        text: "Always read what is printed on the box and the product description before you buy. The exact number of packs, cards per pack and guaranteed hits depend on the manufacturer and the set, so compare the details rather than assuming.",
      },
    ],
  },
  {
    slug: "how-to-store-sealed-trading-card-boxes",
    title: "How to Store Sealed Trading Card Boxes Safely",
    description:
      "Sealed boxes keep their value best when they stay clean, dry and undamaged. These simple storage habits protect your collection for years.",
    date: "2026-10-15",
    shopLink: { label: "Shop collecting supplies", href: "/shop" },
    body: [
      {
        type: "p",
        text: "Sealed product can only be worth what its condition allows. Dented corners, damp air and torn wrap all lower the appeal of a box. The good news is that protecting your boxes costs very little.",
      },
      { type: "h2", text: "Keep them cool, dry and out of the sun" },
      {
        type: "p",
        text: "Heat, humidity and direct sunlight are the biggest enemies of cardboard and printed wrap. Store boxes in a room that stays at a steady temperature, away from windows, bathrooms and basements that can get damp. Avoid attics and garages, where temperatures swing a lot.",
      },
      { type: "h2", text: "Do not stack them too high" },
      {
        type: "p",
        text: "Heavy stacks crush the boxes at the bottom. Keep stacks short, or place boxes upright on a shelf with a little space around them. Never put heavy objects on top of sealed product.",
      },
      { type: "h2", text: "Use protection that fits" },
      {
        type: "ul",
        items: [
          "Clear plastic cases or sleeves made for boxes keep dust off and soften small bumps.",
          "Silica gel packs inside a closed storage bin help control moisture.",
          "Avoid tape or stickers on the box or the wrap, because they can leave marks when removed.",
          "Handle boxes with clean, dry hands and hold them by the sides.",
        ],
      },
      { type: "h2", text: "Check on them now and then" },
      {
        type: "p",
        text: "Look through your collection every few months. If you notice a musty smell, soft cardboard or any sign of moisture, move the box somewhere drier right away and replace the silica gel packs.",
      },
    ],
  },
  {
    slug: "buying-sealed-cards-online-checklist",
    title: "Buying Sealed Trading Cards Online: A Simple Checklist",
    description:
      "Before you order sealed cards online, check these points: the seller, the photos, the packaging, shipping and the return policy.",
    date: "2026-10-15",
    shopLink: { label: "See what is in stock", href: "/shop?inStock=1" },
    body: [
      {
        type: "p",
        text: "Buying sealed cards online is convenient, but it pays to be careful. A few quick checks can save you from disappointment and help you spot a risky offer before you pay.",
      },
      { type: "h2", text: "1. Look at the seller, not only the price" },
      {
        type: "p",
        text: "An unusually low price is a warning sign. Look for a seller with clear contact details, a clear description of each product and a published shipping and returns policy. If you cannot find out who you are buying from, think twice.",
      },
      { type: "h2", text: "2. Read the full product description" },
      {
        type: "p",
        text: "Check the set name, the year, the type of box and what the product contains. Two products with similar names can be very different. If anything is unclear, ask before you order.",
      },
      { type: "h2", text: "3. Check the packaging in the photos" },
      {
        type: "ul",
        items: [
          "The outer wrap should look tight and clean, with no gaps, tears or signs of being reopened.",
          "Corners and edges should look crisp, not crushed.",
          "The photos should match the product you are buying.",
        ],
      },
      { type: "h2", text: "4. Understand shipping and returns" },
      {
        type: "p",
        text: "Know when your order will ship, how it is packed and what happens if something arrives damaged. Our shipping and returns page explains how we handle this, and our FAQ answers common questions about ordering.",
      },
      { type: "h2", text: "5. Keep your records" },
      {
        type: "p",
        text: "Save your order number and confirmation message. If you ever need help with an order, they let the seller find it quickly.",
      },
    ],
  },
];

export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const readingMinutes = (p: Post) => {
  const words = p.body
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

export const formatPostDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
