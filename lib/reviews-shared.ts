// Review type + seed, shared by the client hook, admin page, and server actions.
import { testimonials } from "@/lib/data";

export type Review = {
  id: string;
  quote: string;
  name: string;
  level: string;
  year: number;
  published: boolean;
};

export const seedReviews: Review[] = testimonials.map((t, i) => ({
  ...t, id: `seed-r-${i}`, published: true,
}));
