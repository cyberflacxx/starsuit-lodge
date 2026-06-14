import type { Branch, RoomType, ServiceItem } from "@/types";

export const BRANCHES: Branch[] = [
  {
    name: "Starsuit Lodge Mutare",
    slug: "mutare",
    location: "Mutare",
    description:
      "A polished city-lodge in the heart of Mutare - ideal for business travellers, transit guests, and anyone wanting a modern, well-connected base in Zimbabwe's eastern gateway city.",
  },
  {
    name: "Starsuit Lodge Chipinge",
    slug: "chipinge",
    location: "Chipinge",
    description:
      "A welcoming highland lodge set against Chipinge's scenic surroundings - perfect for leisure stays, nature enthusiasts, and guests looking for a quieter, more relaxed pace.",
  },
];

export const ROOM_TYPES: RoomType[] = [
  {
    name: "Standard Room",
    slug: "standard-room",
    description:
      "A well-appointed room with everything you need for a comfortable night or short stay - clean, quiet, and great value for money.",
    priceLabel: "From $50 per night",
  },
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    description:
      "More space, a queen bed, and a warmer ambience - the Deluxe room suits guests who want a step up in comfort without the executive price tag.",
    priceLabel: "From $75 per night",
  },
  {
    name: "Executive Room",
    slug: "executive-room",
    description:
      "Our finest room category - featuring a king bed, premium furnishings, a full work desk, and the space to truly unwind after a long day.",
    priceLabel: "From $100 per night",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    title: "Comfortable Rooms",
    description:
      "Every room is prepared to a consistent standard - clean linen, functioning amenities, and the quiet you need to rest properly.",
  },
  {
    title: "Secure Parking",
    description:
      "Drive-in guests enjoy secure, guarded parking at both branches. Your vehicle is safe from arrival to departure.",
  },
  {
    title: "Pickup Support",
    description:
      "Arriving by bus or plane? Request a pickup from Mutare or Chipinge stations and we will arrange transport to the lodge on your behalf.",
  },
  {
    title: "Online Booking",
    description:
      "Reserve your room from any device, any time - no phone calls or waiting. Instant confirmation sent to your email.",
  },
  {
    title: "Guest Assistance",
    description:
      "Our staff are available every day from early morning until late evening to help with directions, recommendations, and anything you need during your stay.",
  },
  {
    title: "Two Branch Locations",
    description:
      "Heading to Mutare for business or exploring Chipinge's highlands? Choose the branch that suits your itinerary - same quality, different atmosphere.",
  },
];

export const MOCK_ECOCASH_USSD = "tel:*153*1*1*0788064458*50%23";
export const MOCK_ECOCASH_DISPLAY_CODE = "*153*1*1*0788064458*50#";
