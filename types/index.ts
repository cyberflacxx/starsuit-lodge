export type NavItem = {
  label: string;
  href: string;
};

export type Branch = {
  name: string;
  slug: string;
  location: string;
  description: string;
};

export type RoomType = {
  name: string;
  slug: string;
  description: string;
  priceLabel: string;
};

export type ServiceItem = {
  title: string;
  description: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  mainNav: NavItem[];
  branches: Branch[];
  contact: {
    phone: string;
    email: string;
  };
  colors: {
    primary: string;
    primaryDeep: string;
    accent: string;
    background: string;
    muted: string;
    foreground: string;
  };
};

export type AdminRole = "SUPER_ADMIN" | "BRANCH_ADMIN" | "RECEPTIONIST";

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  branchId: string | null;
  isActive: boolean;
  branch: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "bookings"
    | "content"
    | "notifications"
    | "reports"
    | "rooms"
    | "availability"
    | "branches"
    | "payments"
    | "gallery"
    | "settings";
  disabled?: boolean;
};

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type BranchSummary = {
  id: string;
  name: string;
  slug: string;
  city: string;
  phone: string;
  email: string;
  isActive: boolean;
};

export type RoomTypeSummary = {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  capacity: number;
  bedType: string;
  amenities: string[];
  isActive: boolean;
};

export type BookingFormDraft = {
  branchId: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  expectedArrivalTime?: string;
  numberOfGuests: number;
  isBookingForTwo: boolean;
  transportOption: "OWN_CAR" | "NEED_PICKUP" | "NO_TRANSPORT_SUPPORT";
  hasOwnCar: boolean;
  needsParking: boolean;
  needsPickup: boolean;
  pickupPoint?: string;
  specialRequests?: string;
  guest: {
    firstName: string;
    surname: string;
    idNumber?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    phone: string;
    email?: string;
  };
};

export type AvailabilityRoom = {
  id: string;
  roomNumber: string;
  branchId: string;
  branchName: string;
  roomTypeId: string;
  roomTypeName: string;
  capacity: number;
  pricePerNight: number;
  estimatedTotal: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED";
};

export type AvailabilitySummary = {
  branch: {
    id: string;
    name: string;
    city: string;
  } | null;
  roomType: {
    id: string;
    name: string;
    slug: string;
  } | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  numberOfGuests: number;
  availableRooms: AvailabilityRoom[];
  availableCount: number;
  lowestPrice: number | null;
  estimatedTotalFrom: number | null;
  isFullyBooked: boolean;
  message: string;
};

export type AvailabilitySearchState = {
  success: boolean;
  message: string;
  data?: AvailabilitySummary;
  errors?: Partial<
    Record<
      "branchId" | "roomTypeId" | "checkInDate" | "checkOutDate" | "numberOfGuests",
      string[]
    >
  >;
};

export type BookingStep = {
  id: string;
  order: number;
  title: string;
  description: string;
};

export type GuestBookingFormState = {
  success: boolean;
  message: string;
  bookingReference?: string;
  redirectTo?: string;
  errors?: Record<string, string[] | undefined>;
};

export type GuestBookingStep =
  | "SELECT_ROOM"
  | "GUEST_DETAILS"
  | "TRANSPORT_AND_ARRIVAL"
  | "REVIEW_AND_CONFIRM";

export type BookingSummary = {
  bookingReference?: string;
  guestName?: string;
  branchName: string;
  roomTypeName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  numberOfGuests: number;
  pricePerNight: number;
  totalAmount: number;
  paymentStatus?: PaymentStatus;
};

export type CreatedBookingResult = {
  bookingReference: string;
  totalAmount: number;
  paymentId: string;
  branch: {
    id: string;
    name: string;
    city: string;
  };
  room: {
    id: string;
    roomNumber: string;
    status: string;
  };
  roomType: {
    id: string;
    name: string;
    capacity: number;
    basePrice: number;
  };
  guest: {
    id: string;
    firstName: string;
    surname: string;
    phone: string;
    email: string;
  };
};
