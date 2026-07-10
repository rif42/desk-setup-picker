import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  LampDesk,
  Monitor,
  MonitorSpeaker,
  Flower2,
  Headphones,
  Table2,
  TableProperties,
} from "lucide-react";

export type Category = "desk" | "chair" | "accessory";

export type CatalogItem = {
  id: string;
  name: string;
  tagline: string;
  price: number; // IDR per month
  category: Category;
  icon: LucideIcon;
  tint: string; // tailwind token class for the preview scene
};

export const desks: CatalogItem[] = [
  {
    id: "desk-standing",
    name: "Standing Desk Pro",
    tagline: "Electric sit/stand, 140cm oak top",
    price: 450_000,
    category: "desk",
    icon: TableProperties,
    tint: "bg-amber-700",
  },
  {
    id: "desk-compact",
    name: "Nomad Compact",
    tagline: "Light 110cm, fits a villa corner",
    price: 280_000,
    category: "desk",
    icon: Table2,
    tint: "bg-stone-600",
  },
  {
    id: "desk-bali",
    name: "Bali Teak",
    tagline: "Solid teak, warm island grain",
    price: 620_000,
    category: "desk",
    icon: TableProperties,
    tint: "bg-orange-800",
  },
];

export const chairs: CatalogItem[] = [
  {
    id: "chair-ergo",
    name: "Ergo Mesh",
    tagline: "Lumbar support, breathable mesh",
    price: 320_000,
    category: "chair",
    icon: Armchair,
    tint: "bg-slate-700",
  },
  {
    id: "chair-task",
    name: "Task Chair",
    tagline: "Simple, comfy, rolls easy",
    price: 210_000,
    category: "chair",
    icon: Armchair,
    tint: "bg-zinc-600",
  },
  {
    id: "chair-lounge",
    name: "Lounge Rattan",
    tagline: "Relaxed rattan for slow days",
    price: 380_000,
    category: "chair",
    icon: Armchair,
    tint: "bg-emerald-800",
  },
];

export const accessories: CatalogItem[] = [
  {
    id: "acc-monitor",
    name: '27" 4K Monitor',
    tagline: "Crisp screen for deep focus",
    price: 350_000,
    category: "accessory",
    icon: Monitor,
    tint: "bg-sky-700",
  },
  {
    id: "acc-monitor-2",
    name: "Second Monitor",
    tagline: "Dual-screen flow state",
    price: 350_000,
    category: "accessory",
    icon: MonitorSpeaker,
    tint: "bg-indigo-700",
  },
  {
    id: "acc-lamp",
    name: "Desk Lamp",
    tagline: "Warm light, late sessions",
    price: 90_000,
    category: "accessory",
    icon: LampDesk,
    tint: "bg-yellow-500",
  },
  {
    id: "acc-plant",
    name: "Monstera Plant",
    tagline: "A bit of jungle on the desk",
    price: 70_000,
    category: "accessory",
    icon: Flower2,
    tint: "bg-green-600",
  },
  {
    id: "acc-headphones",
    name: "ANC Headphones",
    tagline: "Block out the cafe noise",
    price: 120_000,
    category: "accessory",
    icon: Headphones,
    tint: "bg-fuchsia-700",
  },
];

export const catalog: CatalogItem[] = [...desks, ...chairs, ...accessories];

export const byId = (id: string) => catalog.find((item) => item.id === id);
