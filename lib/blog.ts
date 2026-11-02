// Blog posts live here. To add a post, copy one block inside `posts`, change the text, and push.
// date format: YYYY-MM-DD. slug: lowercase words joined by dashes (it becomes the page address).

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "links"; items: { label: string; href: string }[] };

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
  {
    slug: "pokemon-booster-box-vs-elite-trainer-box",
    title: "Sealed Pokémon TCG Products Explained: Booster Boxes vs Elite Trainer Boxes",
    description:
      "Booster boxes and Elite Trainer Boxes are the most popular sealed Pokémon TCG products. Here is what each one is and how to pick the right one.",
    date: "2026-11-02",
    shopLink: { label: "Shop sealed Pokémon TCG products", href: "/shop?category=pokemon" },
    body: [
      {
        type: "p",
        text: "Walk into the sealed Pokémon section of any card shop, or browse an online store, and two product types appear more than any others: booster boxes and Elite Trainer Boxes. They sit side by side, they come from the same sets, and they both hold booster packs — yet they are built for different kinds of collectors. Whether you are buying your first sealed Pokémon product or deciding where your next collecting budget goes, it helps to know exactly what each one is.",
      },
      { type: "h2", text: "What is a Pokémon TCG booster box?" },
      {
        type: "p",
        text: "A booster box is a sealed box holding multiple booster packs from a single Pokémon TCG set. It is the product collectors reach for when they want to open a lot of packs from one set — whether they are filling a binder, building a trade pile, or simply enjoying the experience of opening packs. Because every pack comes from the same set, a booster box is also a popular way to work toward completing that set. The exact number of packs inside varies from product to product, so always check the product description before you buy.",
      },
      { type: "h2", text: "What is a Pokémon TCG Elite Trainer Box?" },
      {
        type: "p",
        text: "An Elite Trainer Box, usually shortened to ETB, is a different kind of sealed product. Alongside a number of booster packs from one set, it includes collector accessories: card sleeves, dice, condition markers, dividers, energy cards and a player's guide to the set. It comes in a sturdy storage box that many collectors reuse to hold their cards long after the packs are opened. Think of it as a starter kit for a set: packs to open plus the gear you need to store and play with what you pull. If you are buying for a younger collector, the player's guide inside is a genuine bonus: it explains the set in plain language and doubles as a checklist. As with booster boxes, the exact contents change from set to set, so read the product description for the specific box you are considering.",
      },
      { type: "h2", text: "Booster box vs Elite Trainer Box: how they compare" },
      {
        type: "ul",
        items: [
          "Packs: a booster box is about volume — it exists to give you many packs from one set. An ETB gives you fewer packs and adds accessories instead.",
          "Accessories: only the ETB includes sleeves, dice, dividers and a storage box.",
          "Price: ETBs generally cost less than booster boxes, which makes them a common first purchase for new collectors.",
          "Collecting goal: working toward set completion favors the booster box; starting a collection or buying a gift favors the ETB.",
          "Storage: the ETB's box doubles as card storage, while booster boxes are usually recycled once opened.",
        ],
      },
      { type: "h2", text: "What about booster bundles, tins and collection boxes?" },
      {
        type: "p",
        text: "Booster boxes and ETBs are the headliners, but the Pokémon TCG comes in other sealed formats worth knowing. Booster bundles hold a smaller number of packs and sit between single packs and full boxes on price, which makes them a sensible middle step. Tins pair a few packs with a collectible storage tin, which makes them popular gifts. Collection boxes bundle packs with a promo or oversized card. Build and Battle boxes are designed for prerelease-style play with friends or at a local game store. Each format suits a different budget and goal, and most collectors mix them over time rather than sticking to one.",
      },
      {
        type: "ul",
        items: [
          "Small budget or a first purchase: a sleeved booster pack or a booster bundle.",
          "A gift for a collector: a tin or a collection box, where the packaging is part of the appeal.",
          "Learning to play the game: a Build and Battle box.",
          "Going deep on one set: a booster box.",
        ],
      },
      { type: "h2", text: "Which one should you buy?" },
      {
        type: "p",
        text: "There is no wrong answer here, but your goal should decide it. Be honest about what you want from the purchase before you spend.",
      },
      {
        type: "ul",
        items: [
          "Buy a booster box if you want the most packs from a single set — for example, while working through the Mega Evolution sets — and you are building toward set completion or trade stock.",
          "Buy an Elite Trainer Box if you are new to a set, you need sleeves and storage, or you are buying for someone else.",
          "Buy across formats over time if you are collecting a favorite set seriously. Many collectors do exactly that.",
          "Whatever you choose, confirm the set name and year on the product page before you order. Similarly named products from different sets are easy to mix up.",
        ],
      },
      {
        type: "links",
        items: [
          { label: "Pokémon Mega Evolution Elite Trainer Box", href: "/products/pokemon-mega-evolution-elite-trainer-box" },
          { label: "Pokémon Mega Evolution Phantasmal Flames Booster Bundle Box", href: "/products/pokemon-mega-evolution-phantasmal-flames-booster-bundle-box" },
          { label: "Pokémon Scarlet & Violet Destined Rivals Booster Box", href: "/products/pokemon-scarlet-and-violet-destined-rivals-booster-box" },
          { label: "Browse all sealed Pokémon TCG products", href: "/shop?category=pokemon" },
        ],
      },
      { type: "h2", text: "Why buy sealed — and keep it sealed" },
      {
        type: "p",
        text: "Sealed product holds its appeal because nobody has touched what is inside. That is also why you should buy from sellers with clear photos, accurate descriptions and a published shipping and returns policy, and be cautious of prices far below the market. When your order arrives, check that the plastic wrap is tight and undamaged before the box goes on your shelf. A careful seller packs boxes so they arrive the way they left. For higher-value boxes, some collectors photograph the sealed product on arrival, so there is a record of its condition from day one.",
      },
      { type: "h2", text: "A final tip before you buy" },
      {
        type: "p",
        text: "Read the product description carefully every time: set name, year, product type and what is inside. Sealed Pokémon products from different sets can look alike, and demand shifts, so compare before you commit. If you are ordering from the US or Canada, check the store's shipping and returns page first so you know how your order will be packed and what happens if anything arrives damaged.",
      },
    ],
  },
  {
    slug: "how-to-start-collecting-pokemon-cards",
    title: "How to Start Collecting Pokémon Cards in 2026",
    description:
      "New to the Pokémon TCG? This beginner's guide covers sealed products, choosing a set, budgeting, storage and safe buying for US and Canadian collectors.",
    date: "2026-11-02",
    shopLink: { label: "Browse sealed Pokémon products", href: "/shop?category=pokemon" },
    body: [
      {
        type: "p",
        text: "The Pokémon Trading Card Game keeps growing, and 2026 is a good time to start. The Mega Evolution era is underway, Scarlet & Violet sets like Destined Rivals and 151 are still widely available, and Sword & Shield products remain on shelves for collectors who like older sets. But a new collector faces a wall of choices: booster boxes, Elite Trainer Boxes, tins, blisters, collection boxes. This guide walks through the decisions in order, so your first purchases are ones you will still be happy with a year from now.",
      },
      { type: "h2", text: "1. Decide what kind of collector you want to be" },
      {
        type: "p",
        text: "Some collectors chase complete sets, binder by binder. Some collect sealed product and never open it. Some buy to play the game. Your style decides what you should buy, so settle it early. If you love the moment of opening packs, sealed product is your lane. If you mainly want specific cards for a binder or a deck, buying single cards is usually cheaper than opening packs until you find them — but that is a different hobby from sealed collecting, and this guide focuses on sealed.",
      },
      { type: "h2", text: "2. Learn the sealed product formats" },
      {
        type: "p",
        text: "Start with the two most common formats. Booster boxes give you the most packs from one set and suit collectors working toward completing it. Elite Trainer Boxes pair packs with sleeves, dice, dividers and a storage box, which makes them the classic first purchase. Around them sit booster bundles, tins, blister packs and collection boxes at lower price points, plus Build and Battle boxes for players. Our guide to booster boxes versus Elite Trainer Boxes breaks down the two big formats in detail, and it is worth a read before you spend. If a product name confuses you, read it piece by piece: the set name, the year, and words like box, pack, tin or bundle usually tell you exactly what you are looking at.",
      },
      { type: "h2", text: "3. Pick one set and start there" },
      {
        type: "p",
        text: "It is tempting to buy a little of everything. Resist it. Pick one current set — from the Mega Evolution era, or a Scarlet & Violet set such as Destined Rivals or 151 — and focus your first purchases there. Collecting one set at a time keeps your binder organized, your budget intact and your trade pile coherent. You can always branch out later. Sealed product from earlier sets does not expire, so there is no rush to buy it all at once. Local game stores across the US and Canada often run prerelease events for new sets, which is a fun, low-pressure way to open packs and meet other collectors.",
      },
      { type: "h2", text: "4. Set a budget before you buy" },
      {
        type: "p",
        text: "Sealed Pokémon products range from a few dollars for a single sleeved pack to much larger amounts for boxes and cases, and it is easy to overspend in the excitement of a new hobby. Decide what the hobby is worth to you each month and treat that number as a hard cap.",
      },
      {
        type: "ul",
        items: [
          "Start small: a few sleeved packs or a booster bundle teaches you the hobby cheaply.",
          "Track what you spend. A simple note on your phone is enough.",
          "Do not chase hype. Prices spike around popular releases and usually calm down afterward.",
          "Buy what fits the budget. The cards will still be there next month.",
        ],
      },
      { type: "h2", text: "5. Buy sealed from sellers you trust" },
      {
        type: "p",
        text: "The golden rule of sealed collecting: buy factory-sealed product from a seller with clear photos, accurate descriptions and a published shipping and returns policy. Be cautious of prices far below the market — when a deal looks too good, it usually is. Save your order confirmations. When the box arrives, check that the wrap is tight and undamaged before it goes on the shelf.",
      },
      { type: "h2", text: "What to do with the cards you pull" },
      {
        type: "p",
        text: "Opening packs leaves you with a stack of cards, and a small routine keeps them in good shape. Sleeve anything you want to keep the moment it comes out of the pack — pack-fresh cards scratch easily. Sort the rest into bulk storage or a trade binder. Many collectors keep a simple system: one binder for the set they are completing, one box for trade stock, and sleeves for anything valuable. You do not need expensive supplies on day one; basic sleeves and a binder carry most beginners a long way.",
      },
      { type: "h2", text: "6. Store what you keep" },
      {
        type: "p",
        text: "Cards and sealed boxes last best kept cool, dry and out of direct sunlight. Sleeves and binders protect individual cards; sealed boxes do best standing upright on a shelf rather than stacked under heavy items. A little care at the start prevents real disappointment later — few things sting like finding a warped box you paid good money for. In older homes, keep boxes away from exterior walls, where condensation can form without you noticing.",
      },
      {
        type: "links",
        items: [
          { label: "Pokémon Scarlet & Violet 151 Ultra Premium Collection Box", href: "/products/pokemon-scarlet-and-violet-151-ultra-premium-collection-box" },
          { label: "Pokémon Mega Evolution Chaos Rising Sleeved Booster Pack", href: "/products/pokemon-mega-evolution-chaos-rising-sleeved-booster-pack" },
          { label: "Booster Box vs Elite Trainer Box: the full comparison", href: "/blog/pokemon-booster-box-vs-elite-trainer-box" },
          { label: "Shipping & returns info", href: "/shipping-returns" },
        ],
      },
      { type: "h2", text: "Enjoy the hobby" },
      {
        type: "p",
        text: "Collecting Pokémon cards is a hobby, not a race. Open what excites you, keep what you love, trade the rest, and let the collection grow at your own pace. Whether you are collecting in the US or Canada, the same rules apply: buy sealed, stay inside your budget, and buy from sellers you trust. Set small goals — finishing one set, or filling one binder page — and enjoy hitting them. That steady progress is what keeps the hobby fun for years.",
      },
    ],
  },
];

export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const readingMinutes = (p: Post) => {
  const words = p.body
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.type === "links" ? b.items.map((i) => i.label).join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

export const formatPostDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
