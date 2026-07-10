import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Keyboard,
  Laptop,
  Monitor,
  MonitorSpeaker,
  Mouse,
  Sofa,
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
  image: string; // "/<id>.webp" — picker/basket cutout
  envImage: string; // "/env-<id>.webp" — composited scene layer
  icon: LucideIcon; // fallback only
  tint: string; // fallback only — tailwind token class
};

export const desks: CatalogItem[] = [
  {
    id: "desk-standing-electric",
    name: "Electric Standing Desk",
    tagline: "Electric sit/stand, black top, silver columns",
    price: 550_000,
    category: "desk",
    image: "/desk-standing-electric.webp",
    envImage: "/env-desk-standing-electric.webp",
    icon: TableProperties,
    tint: "bg-amber-700",
  },
  {
    id: "desk-adjustable",
    name: "Adjustable Desk",
    tagline: "Height-adjustable, white top, black frame",
    price: 400_000,
    category: "desk",
    image: "/desk-adjustable.webp",
    envImage: "/env-desk-adjustable.webp",
    icon: Table2,
    tint: "bg-stone-500",
  },
  {
    id: "desk-compact",
    name: "Compact Desk",
    tagline: "Small fixed table, fits a villa corner",
    price: 200_000,
    category: "desk",
    image: "/desk-compact.webp",
    envImage: "/env-desk-compact.webp",
    icon: Table2,
    tint: "bg-stone-600",
  },
];

export const chairs: CatalogItem[] = [
  {
    id: "chair-ergo-mesh",
    name: "Fantech Ergo Mesh",
    tagline: "High-back mesh, headrest, armrests",
    price: 350_000,
    category: "chair",
    image: "/chair-ergo-mesh.webp",
    envImage: "/env-chair-ergo-mesh.webp",
    icon: Armchair,
    tint: "bg-slate-700",
  },
  {
    id: "chair-mia",
    name: "Mia Side Chair",
    tagline: "Sculptural black shell, metal legs",
    price: 150_000,
    category: "chair",
    image: "/chair-mia.webp",
    envImage: "/env-chair-mia.webp",
    icon: Sofa,
    tint: "bg-zinc-800",
  },
  {
    id: "chair-task-basic",
    name: "Basic Task Chair",
    tagline: "Armless grey fabric, rolls easy",
    price: 120_000,
    category: "chair",
    image: "/chair-task-basic.webp",
    envImage: "/env-chair-task-basic.webp",
    icon: Armchair,
    tint: "bg-zinc-500",
  },
];

export const accessories: CatalogItem[] = [
  {
    id: "acc-monitor-34-gaming",
    name: '34" 4K Gaming Monitor',
    tagline: "Ultrawide immersion, code + docs",
    price: 400_000,
    category: "accessory",
    image: "/acc-monitor-34-gaming.webp",
    envImage: "/env-acc-monitor-34-gaming.webp",
    icon: MonitorSpeaker,
    tint: "bg-indigo-700",
  },
  {
    id: "acc-monitor-27-4k",
    name: '27" 4K A27U Monitor',
    tagline: "Crisp 4K multitasking screen",
    price: 300_000,
    category: "accessory",
    image: "/acc-monitor-27-4k.webp",
    envImage: "/env-acc-monitor-27-4k.webp",
    icon: Monitor,
    tint: "bg-sky-700",
  },
  {
    id: "acc-keyboard-mx",
    name: "Logitech MX Keys",
    tagline: "Low-profile wireless keyboard",
    price: 120_000,
    category: "accessory",
    image: "/acc-keyboard-mx.webp",
    envImage: "/env-acc-keyboard-mx.webp",
    icon: Keyboard,
    tint: "bg-neutral-700",
  },
  {
    id: "acc-mouse-mx-master",
    name: "Logitech MX Master 3S",
    tagline: "Ergo wireless mouse, quiet clicks",
    price: 110_000,
    category: "accessory",
    image: "/acc-mouse-mx-master.webp",
    envImage: "/env-acc-mouse-mx-master.webp",
    icon: Mouse,
    tint: "bg-neutral-600",
  },
  {
    id: "acc-laptop-stand",
    name: "Aluminium Laptop Stand",
    tagline: "Raises screen to eye level",
    price: 60_000,
    category: "accessory",
    image: "/acc-laptop-stand.webp",
    envImage: "/env-acc-laptop-stand.webp",
    icon: Laptop,
    tint: "bg-gray-500",
  },
];

export const catalog: CatalogItem[] = [...desks, ...chairs, ...accessories];

export const byId = (id: string) => catalog.find((item) => item.id === id);

export const isMonitorId = (id: string) => id.startsWith("acc-monitor");
