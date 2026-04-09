export interface MenuItem {
  name: string;
  price: string;
  emoji: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface HoursRow {
  day: string;
  hours: string;
  open: boolean;
}

export type RichCard =
  | { type: 'hours'; rows: HoursRow[] }
  | { type: 'location'; address: string; landmark?: string }
  | { type: 'contact'; phone: string; hours: string; address: string }
  | { type: 'delivery'; area: string; minOrder: string; fee: string; phone: string }
  | { type: 'order'; phone: string; cakeNote: string };

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  menuSections?: MenuSection[];
  richCard?: RichCard;
}

export interface PredefinedEntry {
  trigger: string;
  response: string;
  followUps: string[];
  menuSections?: MenuSection[];
  richCard?: RichCard;
}
