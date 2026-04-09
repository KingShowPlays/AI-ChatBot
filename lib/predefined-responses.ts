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
    response:
      "We're open **Monday to Saturday, 8:00 AM – 7:00 PM**. We are closed on Sundays. Feel free to visit or call us anytime during those hours! ☀️",
    followUps: ["Location", "View Menu & Prices", "Contact Us"],
  },
  {
    trigger: "Location",
    response:
      "📍 Find us at **Rd 123, Port Harcourt, Rivers State**. We'd love to have you visit! If you need directions, give us a call at **08125888459**.",
    followUps: ["Opening Hours", "Delivery Info", "Contact Us"],
  },
  {
    trigger: "Delivery Info",
    response:
      "🚚 We deliver **within Lagos Island** for orders above **₦5,000**. A flat delivery fee of **₦1,000** applies. To arrange delivery, call us at **08125888459** during business hours (Mon–Sat, 8AM–7PM).",
    followUps: ["View Menu & Prices", "Place an Order", "Contact Us"],
  },
  {
    trigger: "Contact Us",
    response:
      "📞 Give us a call at **08125888459**. We're available **Monday to Saturday, 8AM–7PM**. You can also visit us at **Rd 123, Port Harcourt, Rivers State**. We're always happy to help! 😊",
    followUps: ["Opening Hours", "Location", "Place an Order"],
  },
  {
    trigger: "Place an Order",
    response:
      "To place an order, please call us at **08125888459** during business hours (Mon–Sat, 8AM–7PM). 🎉\n\nFor **birthday cakes**, we recommend ordering at least **2–3 days in advance** so we can make it perfect for you!",
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
