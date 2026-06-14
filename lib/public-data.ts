import "server-only";

import { prisma } from "@/lib/prisma";
import { getPublicBranchSlug } from "@/lib/branch-utils";
import { BRANCHES, ROOM_TYPES, SERVICES } from "@/lib/constants";
import { fallbackGalleryPlaceholders } from "@/lib/media-placeholders";

type PublicBranch = {
  id: string;
  name: string;
  slug: string;
  publicSlug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  mapUrl: string;
  isActive: boolean;
};

type PublicService = {
  id: string;
  branchId: string | null;
  title: string;
  description: string;
  iconName: string | null;
};

type PublicGalleryImage = {
  id: string;
  branchId: string | null;
  branchName: string | null;
  branchSlug: string | null;
  title: string;
  altText: string;
  imageUrl: string;
  sortOrder: number;
  isFeatured: boolean;
};

type PublicRoomType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  capacity: number;
  bedType: string;
  amenities: string[];
  isActive: boolean;
};

type PublicBranchSummary = {
  id: string;
  name: string;
  slug: string;
  city: string;
  phone: string;
  email: string;
  isActive: boolean;
};

function mapBranch(branch: {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  mapUrl: string;
  isActive: boolean;
}): PublicBranch {
  return {
    ...branch,
    publicSlug: getPublicBranchSlug(branch),
  };
}

const BRANCH_STATIC: Record<string, { address: string; email: string; mapUrl: string }> = {
  mutare: {
    address: "Starsuit Lodge, Mutare, Manicaland, Zimbabwe",
    email: "starsuitmutare@gmail.com",
    mapUrl: "https://www.google.com/maps/search/starsuit+lodge+mutare+zimbabwe",
  },
  chipinge: {
    address: "Starsuit Lodge, Chipinge, Manicaland, Zimbabwe",
    email: "bookings@starsuitlodges.com",
    mapUrl: "https://www.google.com/maps/search/starsuit+lodge+chipinge+zimbabwe",
  },
};

const FALLBACK_BRANCHES: PublicBranch[] = BRANCHES.map((b, i) => ({
  id: `fallback-branch-${i}`,
  name: b.name,
  slug: b.slug,
  publicSlug: b.slug,
  description: b.description,
  address: BRANCH_STATIC[b.slug]?.address ?? `Starsuit Lodge, ${b.location}, Zimbabwe`,
  city: b.location,
  phone: "+263 78 806 4458",
  email: BRANCH_STATIC[b.slug]?.email ?? "bookings@starsuitlodges.com",
  mapUrl: BRANCH_STATIC[b.slug]?.mapUrl ?? "",
  isActive: true,
}));

export async function getActiveBranches() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    if (branches.length === 0) return FALLBACK_BRANCHES;
    return branches.map(mapBranch);
  } catch {
    return FALLBACK_BRANCHES;
  }
}

export async function getBranchBySlug(slug: string) {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true,
      },
      include: {
        services: {
          where: {
            isActive: true,
          },
          orderBy: {
            title: "asc",
          },
        },
        galleryImages: {
          where: {
            isActive: true,
          },
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        },
      },
    });

    const branch = branches.find((item) => {
      const publicSlug = getPublicBranchSlug(item);
      return item.slug === slug || publicSlug === slug;
    });

    if (!branch) {
      return null;
    }

    return {
      ...mapBranch(branch),
      services: branch.services.map((service) => ({
        id: service.id,
        branchId: service.branchId,
        title: service.title,
        description: service.description,
        iconName: service.iconName,
      })),
      galleryImages: branch.galleryImages.map((image) => ({
        id: image.id,
        branchId: image.branchId,
        branchName: branch.name,
        branchSlug: getPublicBranchSlug(branch),
        title: image.title,
        altText: image.altText,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder,
        isFeatured: image.isFeatured,
      })),
    };
  } catch {
    return null;
  }
}

const ROOM_TYPE_DEFAULTS: Record<string, { capacity: number; bedType: string; amenities: string[]; basePrice: number }> = {
  "standard-room": {
    capacity: 2,
    bedType: "Double / Twin",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Tea & Coffee"],
    basePrice: 50,
  },
  "deluxe-room": {
    capacity: 2,
    bedType: "Queen",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Tea & Coffee", "Mini-bar", "Work Desk"],
    basePrice: 75,
  },
  "executive-room": {
    capacity: 3,
    bedType: "King",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Tea & Coffee", "Mini-bar", "Full Work Desk", "Lounge Seating", "Luxury Toiletries"],
    basePrice: 100,
  },
};

const FALLBACK_ROOM_TYPES: PublicRoomType[] = ROOM_TYPES.map((rt, i) => ({
  id: `fallback-rt-${i}`,
  name: rt.name,
  slug: rt.slug,
  description: rt.description,
  basePrice: String(ROOM_TYPE_DEFAULTS[rt.slug]?.basePrice ?? 50),
  capacity: ROOM_TYPE_DEFAULTS[rt.slug]?.capacity ?? 2,
  bedType: ROOM_TYPE_DEFAULTS[rt.slug]?.bedType ?? "Double",
  amenities: ROOM_TYPE_DEFAULTS[rt.slug]?.amenities ?? [],
  isActive: true,
}));

export async function getActiveRoomTypes() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      where: { isActive: true },
      orderBy: { basePrice: "asc" },
    });

    if (roomTypes.length === 0) return FALLBACK_ROOM_TYPES;

    return roomTypes.map(
      (roomType): PublicRoomType => ({
        id: roomType.id,
        name: roomType.name,
        slug: roomType.slug,
        description: roomType.description,
        basePrice: roomType.basePrice.toFixed(2),
        capacity: roomType.capacity,
        bedType: roomType.bedType,
        amenities: roomType.amenities,
        isActive: roomType.isActive,
      }),
    );
  } catch {
    return FALLBACK_ROOM_TYPES;
  }
}

export async function getActiveBranchSummaries() {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        phone: true,
        email: true,
        isActive: true,
      },
    });

    return branches satisfies PublicBranchSummary[];
  } catch {
    return [] as PublicBranchSummary[];
  }
}

const FALLBACK_SERVICES: PublicService[] = SERVICES.map((s, i) => ({
  id: `fallback-svc-${i}`,
  branchId: null,
  title: s.title,
  description: s.description,
  iconName: null,
}));

export async function getPublicServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ branchId: "asc" }, { title: "asc" }],
    });

    const uniqueServices = new Map<string, PublicService>();
    services.forEach((service) => {
      if (!uniqueServices.has(service.title)) {
        uniqueServices.set(service.title, {
          id: service.id,
          branchId: service.branchId,
          title: service.title,
          description: service.description,
          iconName: service.iconName,
        });
      }
    });

    const result = Array.from(uniqueServices.values());
    if (result.length === 0) return FALLBACK_SERVICES;
    return result;
  } catch {
    return FALLBACK_SERVICES;
  }
}

const FALLBACK_GALLERY: PublicGalleryImage[] = fallbackGalleryPlaceholders.map((item, i) => ({
  id: item.id,
  branchId: null,
  branchName: item.branchName,
  branchSlug:
    item.branchName === "Starsuit Lodge Mutare"
      ? "mutare"
      : item.branchName === "Starsuit Lodge Chipinge"
        ? "chipinge"
        : null,
  title: item.title,
  altText: item.altText,
  imageUrl: item.imageUrl,
  sortOrder: i,
  isFeatured: true,
}));

export async function getFeaturedGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true, isFeatured: true },
      include: { branch: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    if (images.length === 0) return FALLBACK_GALLERY;

    return images.map(
      (image): PublicGalleryImage => ({
        id: image.id,
        branchId: image.branchId,
        branchName: image.branch?.name ?? null,
        branchSlug: image.branch ? getPublicBranchSlug(image.branch) : null,
        title: image.title,
        altText: image.altText,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder,
        isFeatured: image.isFeatured,
      }),
    );
  } catch {
    return FALLBACK_GALLERY;
  }
}

export async function getAllPublicGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      include: { branch: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    if (images.length === 0) return FALLBACK_GALLERY;

    return images.map(
      (image): PublicGalleryImage => ({
        id: image.id,
        branchId: image.branchId,
        branchName: image.branch?.name ?? null,
        branchSlug: image.branch ? getPublicBranchSlug(image.branch) : null,
        title: image.title,
        altText: image.altText,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder,
        isFeatured: image.isFeatured,
      }),
    );
  } catch {
    return FALLBACK_GALLERY;
  }
}

export async function getContentBlock(key: string, branchId?: string) {
  try {
    if (branchId) {
      const branchBlock = await prisma.contentBlock.findFirst({
        where: {
          key,
          branchId,
          status: "PUBLISHED",
        },
      });

      if (branchBlock) {
        return branchBlock;
      }
    }

    return await prisma.contentBlock.findFirst({
      where: {
        key,
        branchId: null,
        status: "PUBLISHED",
      },
    });
  } catch {
    return null;
  }
}

export type {
  PublicBranch,
  PublicBranchSummary,
  PublicGalleryImage,
  PublicRoomType,
  PublicService,
};
