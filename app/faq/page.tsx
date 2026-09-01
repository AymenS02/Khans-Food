import Link from "next/link";

const faqs = [
  {
    question: "How does pickup ordering work?",
    answer:
      "Browse the menu, add items to cart, and complete checkout with your pickup date and time. You'll see your order details in your account when signed in.",
  },
  {
    question: "Can I place a same-day pickup order?",
    answer:
      "Yes, if same-day ordering is still open for the day and pickup times are available during business hours.",
  },
  {
    question: "How is pickup scheduling handled?",
    answer:
      "Pickup times are offered based on business hours and current availability for the selected date.",
  },
  {
    question: "Is there an order cutoff time?",
    answer:
      "Yes. Same-day pickup is limited by the configured cutoff time, and unavailable times are filtered out at checkout.",
  },
  {
    question: "Can I modify or cancel an order?",
    answer:
      "For help with order changes, contact Khans Food directly using the contact page so the team can review your order status.",
  },
  {
    question: "When is payment collected?",
    answer:
      "Menu pickup orders are paid during checkout. Catering payment is collected only after a catering request is reviewed and approved.",
  },
  {
    question: "What catering packages are available?",
    answer:
      "Visit the Catering page to see currently available packages and submit a package request from the package detail page.",
  },
  {
    question: "Can I request custom catering?",
    answer:
      "Yes. Use the custom catering flow to build a request from available catering items.",
  },
  {
    question: "How does catering approval and quoting work?",
    answer:
      "After submission, your catering request is reviewed by Khans Food. Approved requests receive an official quote and an order for payment.",
  },
  {
    question: "How is catering payment completed?",
    answer:
      "Once approved, pay from your account's catering order page. Payment completion is confirmed through the secure payment flow.",
  },
  {
    question: "Can guests pay for approved catering requests?",
    answer:
      "Yes. Approved guest requests can be paid through the dedicated guest catering payment link provided for that request.",
  },
  {
    question: "Do you support allergens or special requests?",
    answer:
      "You can add notes with your order or catering request. Khans Food will review details and follow up when clarification is needed.",
  },
  {
    question: "How can I contact Khans Food?",
    answer:
      "Use the contact page for pickup and catering questions, including order support and event planning.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Khans Food</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg leading-8 text-foreground/60">
          Quick answers about pickup orders, catering requests, approvals, and payment.
        </p>
      </header>

      <section className="mt-10 space-y-4">
        {faqs.map((item) => (
          <details key={item.question} className="group rounded-2xl bg-white p-5 shadow-sm" name="faq">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg text-left text-lg font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <span>{item.question}</span>
              <span className="mt-0.5 shrink-0 text-primary transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-foreground/70">{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Still need help?</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/60">Our team can help with order timing, catering requests, and account questions.</p>
        <Link href="/contact" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Contact Khans Food →
        </Link>
      </section>
    </main>
  );
}
