export interface TestimonialResponse {
  id: string;
  title: string;
  content: string;
  status: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  images: { url: string }[];
  videos: { url: string }[];
}
