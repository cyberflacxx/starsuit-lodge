// Real Unsplash photos used as visual stand-ins while lodge photography is being sourced.
// All URLs use Unsplash's CDN with w/h params for appropriate sizing.

export const branchPlaceholderImages: Record<string, string> = {
  mutare:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
  chipinge:
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80",
};

export const roomTypePlaceholderImages: Record<string, string> = {
  "standard-room":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
  "deluxe-room":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80",
  "executive-room":
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80",
};

export const homeHeroPlaceholderImages = [
  {
    src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
    alt: "Starsuit Lodges elegant lobby and reception area",
    label: "Reception",
  },
  {
    src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    alt: "Spacious guest suite interior",
    label: "Suite Preview",
  },
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    alt: "Lodge courtyard and garden area",
    label: "Courtyard",
  },
];

export const fallbackGalleryPlaceholders = [
  {
    id: "placeholder-mutare-exterior",
    title: "Mutare Exterior",
    altText: "Starsuit Lodge Mutare - hotel exterior with pool",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    branchName: "Starsuit Lodge Mutare",
  },
  {
    id: "placeholder-chipinge-exterior",
    title: "Chipinge Exterior",
    altText: "Starsuit Lodge Chipinge - lodge entrance at dusk",
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80",
    branchName: "Starsuit Lodge Chipinge",
  },
  {
    id: "placeholder-deluxe-room",
    title: "Deluxe Room",
    altText: "Deluxe room with king bed and warm lighting",
    imageUrl:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80",
    branchName: "Room Preview",
  },
  {
    id: "placeholder-reception",
    title: "Reception & Lobby",
    altText: "Modern reception desk with marble finishes",
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80",
    branchName: "Guest Arrival",
  },
  {
    id: "placeholder-dining",
    title: "Dining Lounge",
    altText: "Restaurant and lounge area with ambient lighting",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    branchName: "Shared Spaces",
  },
  {
    id: "placeholder-suite",
    title: "Executive Suite",
    altText: "Luxury executive suite with city view",
    imageUrl:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80",
    branchName: "Room Preview",
  },
  {
    id: "placeholder-pool",
    title: "Pool & Terrace",
    altText: "Outdoor swimming pool and terrace seating area",
    imageUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80",
    branchName: "Starsuit Lodge Mutare",
  },
  {
    id: "placeholder-standard-room",
    title: "Standard Room",
    altText: "Clean and comfortable standard double room",
    imageUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    branchName: "Room Preview",
  },
  {
    id: "placeholder-garden",
    title: "Garden & Grounds",
    altText: "Lush garden grounds and outdoor seating",
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
    branchName: "Starsuit Lodge Chipinge",
  },
];

// Extra hero images used in page banners
export const pageHeroImages: Record<string, string> = {
  home:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85",
  booking:
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1800&q=85",
  about:
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=80",
  branches:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=80",
  rooms:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=80",
  gallery:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80",
  contact:
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=80",
};
