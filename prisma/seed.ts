import { PrismaClient, ContentStatus, RoomStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.roomMaintenanceBlock.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.branch.deleteMany();

  const mutare = await prisma.branch.create({
    data: {
      name: "Starsuit Lodge Mutare",
      slug: "starsuit-lodge-mutare",
      description:
        "A polished lodge branch serving guests who want accessible comfort and dependable hospitality in Mutare.",
      address: "12 Baines Avenue",
      city: "Mutare",
      phone: "+263 78 806 4458",
      email: "mutare@starsuitlodges.com",
      mapUrl: "https://maps.google.com/?q=Starsuit+Lodge+Mutare",
    },
  });

  const chipinge = await prisma.branch.create({
    data: {
      name: "Starsuit Lodge Chipinge",
      slug: "starsuit-lodge-chipinge",
      description:
        "A welcoming branch designed for relaxed stays, transport coordination, and quality lodge service in Chipinge.",
      address: "48 Main Street",
      city: "Chipinge",
      phone: "+263 78 806 4458",
      email: "chipinge@starsuitlodges.com",
      mapUrl: "https://maps.google.com/?q=Starsuit+Lodge+Chipinge",
    },
  });

  const standardRoom = await prisma.roomType.create({
    data: {
      name: "Standard Room",
      slug: "standard-room",
      description: "An efficient room option for comfortable short stays.",
      basePrice: "50.00",
      capacity: 2,
      bedType: "Queen",
      amenities: ["Wi-Fi", "Hot shower", "Work desk"],
    },
  });

  const deluxeRoom = await prisma.roomType.create({
    data: {
      name: "Deluxe Room",
      slug: "deluxe-room",
      description: "A room upgrade with extra comfort and space for guests.",
      basePrice: "75.00",
      capacity: 2,
      bedType: "King",
      amenities: ["Wi-Fi", "Smart TV", "Mini lounge"],
    },
  });

  const executiveRoom = await prisma.roomType.create({
    data: {
      name: "Executive Room",
      slug: "executive-room",
      description: "A premium room category for elevated executive stays.",
      basePrice: "100.00",
      capacity: 2,
      bedType: "King",
      amenities: ["Wi-Fi", "Smart TV", "Mini bar", "Workspace"],
    },
  });

  await prisma.room.createMany({
    data: [
      {
        branchId: mutare.id,
        roomTypeId: standardRoom.id,
        roomNumber: "M101",
        floor: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: mutare.id,
        roomTypeId: standardRoom.id,
        roomNumber: "M102",
        floor: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: mutare.id,
        roomTypeId: deluxeRoom.id,
        roomNumber: "M201",
        floor: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: mutare.id,
        roomTypeId: executiveRoom.id,
        roomNumber: "M301",
        floor: 3,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: chipinge.id,
        roomTypeId: standardRoom.id,
        roomNumber: "C101",
        floor: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: chipinge.id,
        roomTypeId: standardRoom.id,
        roomNumber: "C102",
        floor: 1,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: chipinge.id,
        roomTypeId: deluxeRoom.id,
        roomNumber: "C201",
        floor: 2,
        status: RoomStatus.AVAILABLE,
      },
      {
        branchId: chipinge.id,
        roomTypeId: executiveRoom.id,
        roomNumber: "C301",
        floor: 3,
        status: RoomStatus.AVAILABLE,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Comfortable Rooms",
        description: "Thoughtfully prepared room spaces designed for rest and convenience.",
        iconName: "concierge-bell",
      },
      {
        title: "Secure Parking",
        description: "Parking support with a security-first approach across branches.",
        iconName: "shield",
      },
      {
        title: "Pickup Support",
        description: "A placeholder service area for future transport and arrival assistance.",
        iconName: "car-front",
      },
      {
        title: "Online Booking",
        description: "A booking-ready public structure prepared for the next implementation phase.",
        iconName: "laptop-minimal-check",
      },
      {
        title: "Guest Assistance",
        description: "Friendly support touchpoints from inquiry to stay.",
        iconName: "hand-helping",
      },
      {
        title: "Branch Choice",
        description: "Guests can choose between Mutare and Chipinge based on travel needs.",
        iconName: "map",
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        branchId: mutare.id,
        title: "Mutare exterior",
        altText: "Exterior view for Starsuit Lodge Mutare",
        imageUrl: "/images/stock/mutare-exterior.jpg",
        sortOrder: 1,
        isFeatured: true,
      },
      {
        branchId: chipinge.id,
        title: "Chipinge exterior",
        altText: "Exterior view for Starsuit Lodge Chipinge",
        imageUrl: "/images/stock/chipinge-exterior.jpg",
        sortOrder: 1,
        isFeatured: true,
      },
      {
        title: "Standard room preview",
        altText: "Standard room interior preview",
        imageUrl: "/images/stock/standard-room.jpg",
        sortOrder: 2,
      },
      {
        title: "Executive room preview",
        altText: "Executive room interior preview",
        imageUrl: "/images/stock/executive-room.jpg",
        sortOrder: 3,
      },
    ],
  });

  await prisma.contentBlock.createMany({
    data: [
      {
        key: "homepage-hero",
        title: "Homepage Hero",
        body: "Stay comfortably at Starsuit Lodges with modern accommodation in Mutare and Chipinge.",
        status: ContentStatus.PUBLISHED,
      },
      {
        key: "about-company",
        title: "About Company",
        body: "Starsuit Lodges is building a premium, mobile-first hospitality platform for branch-based lodge bookings.",
        status: ContentStatus.PUBLISHED,
      },
      {
        branchId: mutare.id,
        key: "branch-description",
        title: "Mutare Branch Description",
        body: "Starsuit Lodge Mutare provides convenient city access with polished guest comfort.",
        status: ContentStatus.PUBLISHED,
      },
      {
        branchId: chipinge.id,
        key: "branch-description",
        title: "Chipinge Branch Description",
        body: "Starsuit Lodge Chipinge offers a welcoming branch atmosphere with dependable hospitality.",
        status: ContentStatus.PUBLISHED,
      },
      {
        key: "booking-policy",
        title: "Booking Policy",
        body: "Booking terms, reservation timing, and guest confirmation requirements will be finalized in upcoming modules.",
        status: ContentStatus.DRAFT,
      },
      {
        key: "cancellation-policy",
        title: "Cancellation Policy",
        body: "Cancellation handling, refund timing, and no-show rules will be formalized after the payment module is connected.",
        status: ContentStatus.DRAFT,
      },
    ],
  });

  await prisma.adminUser.createMany({
    data: [
      {
        email: "superadmin@starsuitlodges.com",
        fullName: "Starsuit Super Admin",
        role: UserRole.SUPER_ADMIN,
      },
      {
        email: "mutare@starsuitlodges.com",
        fullName: "Mutare Branch Admin",
        role: UserRole.BRANCH_ADMIN,
        branchId: mutare.id,
      },
      {
        email: "chipinge@starsuitlodges.com",
        fullName: "Chipinge Branch Admin",
        role: UserRole.BRANCH_ADMIN,
        branchId: chipinge.id,
      },
      {
        email: "reception@starsuitlodges.com",
        fullName: "Reception Desk",
        role: UserRole.RECEPTIONIST,
        branchId: mutare.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
