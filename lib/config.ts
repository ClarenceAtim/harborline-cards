// Central, editable store configuration.

export const store = {
  name: "Harborline Cards",
  tagline: "Sealed sports cards, Pokémon boxes and trading card game products",
  phone: "9173231461",
  phoneDisplay: "(917) 323-1461",
  phoneIntl: "+19173231461", // used for the Call / Text / WhatsApp links
  announcement: "Sealed hobby boxes, blasters and booster packs · Questions? Call 9173231461",
  currency: "USD",
  // Public contact email is intentionally blank. Fill in when the seller provides one.
  publicContactEmail: "",
};

export type PaymentMethodId =
  | "bank_transfer" | "zelle" | "cashapp" | "paypal" | "venmo" | "chime" | "crypto"
  | "mobile_money" | "cash_on_delivery";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  enabled: boolean; // ONLY enable what the seller actually supports. Set to false to hide one.
};

export const paymentMethods: PaymentMethod[] = [
  { id: "zelle", label: "Zelle", description: "The seller emails Zelle payment details after reviewing your order.", enabled: true },
  { id: "cashapp", label: "Cash App", description: "The seller emails the Cash App $cashtag after reviewing your order.", enabled: true },
  { id: "paypal", label: "PayPal", description: "The seller emails a PayPal invoice or payment link.", enabled: true },
  { id: "venmo", label: "Venmo", description: "The seller emails Venmo payment details after reviewing your order.", enabled: true },
  { id: "chime", label: "Chime", description: "The seller emails Chime payment details after reviewing your order.", enabled: true },
  { id: "crypto", label: "Crypto (Bitcoin, USDT and more)", description: "The seller emails the wallet address and exact amount after reviewing your order.", enabled: true },
  { id: "bank_transfer", label: "Bank transfer", description: "The seller emails bank details after reviewing your order.", enabled: true },
  { id: "mobile_money", label: "Mobile money", description: "The seller emails mobile-money payment instructions.", enabled: false },
  { id: "cash_on_delivery", label: "Cash on delivery", description: "Pay the courier on delivery, where the seller offers it.", enabled: false },
];

export const enabledPaymentMethods = () => paymentMethods.filter((m) => m.enabled);

export const siteUrl = () => process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const orderStatuses = [
  "pending",
  "awaiting_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;