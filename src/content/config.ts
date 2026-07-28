import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const journeys = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/journeys" }),
  schema: z.object({
    label: z.string(),
    destination: z.string(),
    days: z.number(),
    nights: z.number(),
    price: z.number(),
    priceLevel: z.enum(["鎏光定制", "鎏光臻选", "鎏光远征"]),
    type: z.enum([
      "私人定制",
      "臻选小团",
      "亲子时光",
      "里程碑时刻",
      "极地探索",
      "文化深度",
      "美食美酒",
      "野奢自然",
    ]),
    season: z.string(),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    subtitle: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    hotels: z.array(z.object({
      name: z.string(),
      location: z.string(),
      description: z.string(),
    })).optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    bookingNotes: z.string().optional(),
    cancellationPolicy: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { journeys };