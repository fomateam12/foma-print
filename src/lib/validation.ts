import { z } from "zod";

export const customOrderSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  product: z.string().trim().max(160).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  quantity: z
    .number({ message: "Enter a quantity." })
    .int("Whole numbers only.")
    .min(1, "Quantity must be at least 1.")
    .max(100000, "That's a big order — email us directly."),
  personalization: z
    .string()
    .trim()
    .min(3, "Tell us what you'd like engraved.")
    .max(2000),
  deadline: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  details: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree so we can contact you about your order.",
  }),
  // Honeypot — must stay empty.
  company: z.string().optional(),
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;

export const BUSINESS_TYPES = [
  "Retail store",
  "Online shop",
  "Corporate / promotional",
  "Event planner",
  "Other",
] as const;

export const MONTHLY_VOLUMES = [
  "1–50 items",
  "51–200 items",
  "201–1,000 items",
  "1,000+ items",
] as const;

export const sellerApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name."),
  businessName: z.string().trim().min(2, "Please enter your business name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(40),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  businessType: z.enum(BUSINESS_TYPES, {
    message: "Select your business type.",
  }),
  monthlyVolume: z.enum(MONTHLY_VOLUMES, {
    message: "Select an estimated volume.",
  }),
  productInterest: z
    .string()
    .trim()
    .min(2, "Which products are you interested in?")
    .max(400),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree so we can follow up with you.",
  }),
  company: z.string().optional(),
});

export type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;
