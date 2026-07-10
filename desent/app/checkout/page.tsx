"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWorkspace, selectItems } from "@/lib/store";
import { formatIDR } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "bank" | "ewallet";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "card",
    label: "Card",
    description: "Visa / Mastercard, charged monthly",
    icon: CreditCard,
  },
  {
    id: "bank",
    label: "Bank transfer",
    description: "IDR virtual account, auto-renews",
    icon: Landmark,
  },
  {
    id: "ewallet",
    label: "E-wallet",
    description: "GoPay / OVO / Dana",
    icon: Wallet,
  },
];

const DOS = [
  "Keep gear clean, dry and indoors.",
  "Report any fault within 24 hours.",
  "Use a surge protector for electronics.",
  "Coil cables loosely before pickup.",
];

const DONTS = [
  "Don't disassemble or modify anything.",
  "Don't sublease the setup to others.",
  "Don't leave gear in rain or poolside.",
  "Don't exceed the desk's rated load.",
];

const CARE_NOTES = [
  "Monthly rental includes maintenance and free swaps for manufacturing faults.",
  "Fair wear and tear is covered; accidental damage may incur a repair fee.",
  "Wipe surfaces weekly and keep liquids away from electronics.",
  "Delivery and pickup are scheduled over WhatsApp — keep the packaging for returns.",
];

const CARD =
  "rounded-[2rem] border border-foreground/10 bg-card p-6 shadow-sm sm:p-8";

const primaryLinkClasses =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

const ghostLinkClasses =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

export default function CheckoutPage() {
  const state = useWorkspace();
  const { items, total } = selectItems(state);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [confirmed, setConfirmed] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === method) ?? PAYMENT_METHODS[0];

  const handleConfirm = () => {
    setOrderRef(`MS-${Date.now().toString(36).toUpperCase()}`);
    setConfirmed(true);
  };

  if (items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <main className="min-h-full flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-full"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to designer
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-1 text-foreground/60">
              Review your Bali workspace · billed monthly · no charge today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/60">Monthly total</p>
            <p className="text-2xl font-extrabold tabular-nums">
              {formatIDR(total)}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.section
              key="confirmed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              aria-live="polite"
              className={cn(CARD, "mx-auto max-w-2xl text-center")}
            >
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                <CheckCircle2 className="size-9" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                You&apos;re booked
              </h2>
              <p className="mt-2 text-foreground/60">
                This is a mock confirmation — no payment was taken. We&apos;d
                WhatsApp you to schedule delivery in Bali.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-sm font-semibold tabular-nums">
                Order&nbsp;{orderRef}
              </div>

              <dl className="mt-6 divide-y divide-foreground/10 rounded-2xl bg-foreground/[0.03] text-left text-sm">
                <div className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-foreground/60">Items</dt>
                  <dd className="font-semibold">{items.length}</dd>
                </div>
                <div className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-foreground/60">Payment</dt>
                  <dd className="font-semibold">{selectedMethod.label}</dd>
                </div>
                <div className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-foreground/60">Monthly total</dt>
                  <dd className="font-extrabold tabular-nums">
                    {formatIDR(total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                <Link href="/" className={primaryLinkClasses}>
                  Back to designer
                </Link>
                <Link href="/" className={ghostLinkClasses}>
                  Start a new setup
                </Link>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            >
              <div className="space-y-6">
                <section aria-labelledby="summary-heading" className={CARD}>
                  <h2 id="summary-heading" className="text-lg font-bold">
                    Your setup
                  </h2>
                  <ul className="mt-4 divide-y divide-foreground/10">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-foreground/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="size-16 object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">
                            {item.name}
                          </span>
                          <span className="block truncate text-sm text-foreground/60">
                            {item.tagline}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums text-foreground/80">
                          {formatIDR(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="conduct-heading" className={CARD}>
                  <h2 id="conduct-heading" className="text-lg font-bold">
                    Code of conduct
                  </h2>
                  <p className="mt-1 text-sm text-foreground/60">
                    Treat the gear like your own during the rental.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <RuleList title="Do" tone="do" items={DOS} />
                    <RuleList title="Don't" tone="dont" items={DONTS} />
                  </div>
                </section>

                <section aria-labelledby="care-heading" className={CARD}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className="size-5 text-accent"
                      aria-hidden="true"
                    />
                    <h2 id="care-heading" className="text-lg font-bold">
                      Warranty &amp; care
                    </h2>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                    {CARE_NOTES.map((note) => (
                      <li key={note} className="flex gap-2.5">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="space-y-6 self-start lg:sticky lg:top-8">
                <section aria-labelledby="payment-heading" className={CARD}>
                  <h2 id="payment-heading" className="text-lg font-bold">
                    Payment method
                  </h2>
                  <p className="mt-1 text-sm text-foreground/60">
                    Mock only — pick how you&apos;d be billed.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Payment method"
                    className="mt-4 space-y-2"
                  >
                    {PAYMENT_METHODS.map((m) => {
                      const selected = m.id === method;
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
                            selected
                              ? "border-accent bg-accent/5 ring-1 ring-accent/40"
                              : "border-foreground/10 hover:bg-foreground/[0.03]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-xl",
                              selected
                                ? "bg-accent text-background"
                                : "bg-foreground/5 text-foreground/70",
                            )}
                          >
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">
                              {m.label}
                            </span>
                            <span className="block text-xs text-foreground/60">
                              {m.description}
                            </span>
                          </span>
                          {selected && (
                            <Check
                              className="size-5 shrink-0 text-accent"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className={CARD}>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-foreground/60">
                      Due today
                    </span>
                    <span className="text-2xl font-extrabold tabular-nums">
                      {formatIDR(0)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between border-t border-foreground/10 pt-3">
                    <span className="text-sm text-foreground/60">
                      Then monthly
                    </span>
                    <span className="text-lg font-bold tabular-nums">
                      {formatIDR(total)}
                    </span>
                  </div>
                  <Button
                    className="mt-5 w-full"
                    onClick={handleConfirm}
                  >
                    Confirm booking
                  </Button>
                  <p className="mt-3 text-center text-xs text-foreground/50">
                    Demo checkout — no card, no charge, no account.
                  </p>
                </section>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function RuleList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "do" | "dont";
  items: string[];
}) {
  const isDo = tone === "do";
  const Icon = isDo ? Check : X;
  return (
    <div className="rounded-2xl bg-foreground/[0.03] p-4">
      <h3
        className={cn(
          "text-sm font-bold",
          isDo ? "text-accent" : "text-foreground/70",
        )}
      >
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm text-foreground/70">
        {items.map((text) => (
          <li key={text} className="flex gap-2">
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isDo ? "text-accent" : "text-foreground/50",
              )}
              aria-hidden="true"
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <main className="grid min-h-full flex-1 place-items-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(CARD, "max-w-md text-center")}
      >
        <h1 className="text-2xl font-extrabold">No setup yet</h1>
        <p className="mt-2 text-foreground/60">
          Design your dream Bali workspace first, then come back to rent it.
        </p>
        <Link href="/" className={cn(primaryLinkClasses, "mt-6")}>
          Start designing
        </Link>
      </motion.div>
    </main>
  );
}
