/**
 * Central brand + contact configuration for FomaPrint.
 * Keep all public brand strings here so pages, emails and metadata stay in sync.
 */
export const site = {
  name: "FomaPrint",
  legalName: "FOMA FAMILY LLC",
  tagline: "Personalized & laser-engraved gifts, made to order",
  description:
    "FomaPrint creates personalized, laser-engraved gifts and premium drinkware — custom cutting boards, tumblers, frames, journals and more. Made to order in the USA by FOMA FAMILY LLC.",
  email: "fomafamilydesign@gmail.com",
  phoneDisplay: "(404) 934-8917",
  phoneHref: "tel:+14049348917",
  /** Public site URL. Overridden in production via NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://foma-design.vercel.app",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
  },
} as const;

export const legalLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Custom Orders", href: "/custom-order" },
  { label: "Become a Reseller", href: "/sell" },
] as const;
