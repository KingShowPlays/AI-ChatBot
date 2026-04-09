export interface MenuItem {
  name: string;
  price: string;
  emoji: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  menuSections?: MenuSection[];
}

export interface PredefinedEntry {
  trigger: string;
  response: string;
  followUps: string[];
  menuSections?: MenuSection[];
}
