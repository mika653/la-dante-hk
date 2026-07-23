"use client";
import { IconWhatsapp } from "./SocialIcons";

// Floating WhatsApp button — fixed to the viewport, so it follows the scroll on
// every page. Replaces the scripted chatbot: this reaches a real person at the
// office WhatsApp number.
const WA_NUMBER = "85255128084"; // +852 5512 8084
const WA_MESSAGE = "Hi La Dante! I have a question about your Italian courses.";
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 h-14 rounded-full bg-[#25D366] text-white shadow-[var(--shadow-pop)] hover:brightness-105 transition-all pr-0 hover:pr-5 overflow-hidden"
    >
      <span className="w-14 h-14 shrink-0 inline-flex items-center justify-center">
        <IconWhatsapp size={26} />
      </span>
      {/* Label slides open on hover (desktop); the icon alone is the target on mobile. */}
      <span className="max-w-0 group-hover:max-w-[140px] whitespace-nowrap font-medium text-sm transition-all duration-300 overflow-hidden">
        Chat on WhatsApp
      </span>
    </a>
  );
}
