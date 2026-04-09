import type { PredefinedEntry } from "./types";

export const INITIAL_QUICK_REPLIES: string[] = [
  "View Menu & Prices",
  "Opening Hours",
  "Location",
  "Delivery Info",
  "Contact Us",
  "Place an Order",
];

export const DEFAULT_FOLLOW_UPS: string[] = [
  "View Menu & Prices",
  "Opening Hours",
  "Place an Order",
];

export const PREDEFINED_RESPONSES: PredefinedEntry[] = [
  {
    trigger: "View Menu & Prices",
    response: "Here's our full menu with prices! Anything catch your eye? 😊",
    menuSections: [
      {
        title: "Snacks & Pastries",
        items: [
          { name: "Meat Pie", price: "₦500", emoji: "🥧" },
          { name: "Chicken Pie", price: "₦700", emoji: "🍗" },
          { name: "Sausage Roll", price: "₦400", emoji: "🌭" },
          { name: "Chin Chin (pack)", price: "₦1,500", emoji: "🍪" },
          { name: "Doughnut", price: "₦300", emoji: "🍩" },
        ],
      },
      {
        title: "Birthday Cakes",
        items: [
          { name: "Small Cake", price: "₦15,000", emoji: "🎂" },
          { name: "Medium Cake", price: "₦25,000", emoji: "🎂" },
          { name: "Large Cake", price: "₦40,000", emoji: "🎂" },
        ],
      },
    ],
    followUps: ["Place an Order", "Delivery Info", "Opening Hours"],
  },
  {
    trigger: "Opening Hours",
    response: "Here's when you can find us! ☀️",
    richCard: {
      type: "hours",
      rows: [
        { day: "Monday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Tuesday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Wednesday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Thursday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Friday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Saturday", hours: "8:00 AM – 7:00 PM", open: true },
        { day: "Sunday", hours: "Closed", open: false },
      ],
    },
    followUps: ["Location", "View Menu & Prices", "Contact Us"],
  },
  {
    trigger: "Location",
    response: "Come visit us! We'd love to see you. 📍",
    richCard: {
      type: "location",
      address: "Avenue 123, Port Harcourt, Rivers",
      landmark: "Near Lagos Island General Hospital",
    },
    followUps: ["Opening Hours", "Delivery Info", "Contact Us"],
  },
  {
    trigger: "Delivery Info",
    response: "Here's everything you need to know about our delivery. 🚚",
    richCard: {
      type: "delivery",
      area: "Within Lagos Island",
      minOrder: "₦5,000",
      fee: "₦1,000 flat",
      phone: "08125888459",
    },
    followUps: ["View Menu & Prices", "Place an Order", "Contact Us"],
  },
  {
    trigger: "Contact Us",
    response: "We're always happy to help! Reach us here. 😊",
    richCard: {
      type: "contact",
      phone: "08125888459",
      hours: "Mon – Sat, 8:00 AM – 7:00 PM",
      address: "Avenue 123, Port Harcourt, Rivers",
    },
    followUps: ["Opening Hours", "Location", "Place an Order"],
  },
  {
    trigger: "Place an Order",
    response: "Ready to order? Here's how! 🎉",
    richCard: {
      type: "order",
      phone: "08125888459",
      cakeNote: "For birthday cakes, order at least 2–3 days in advance.",
    },
    followUps: ["View Menu & Prices", "Delivery Info", "Contact Us"],
  },
];

export function findPredefinedResponse(
  message: string
): PredefinedEntry | null {
  const normalized = message.trim().toLowerCase();
  return (
    PREDEFINED_RESPONSES.find(
      (entry) => entry.trigger.toLowerCase() === normalized
    ) ?? null
  );
}
