import type { CustomerSession } from "@/lib/customer-auth";
import { ProfileHub } from "@/components/profile/ProfileHub";

type OrderRow = {
  id: string;
  ref: string;
  status: string;
  total: number;
  createdAt: Date;
};

type ServiceRow = {
  id: string;
  ref: string;
  serviceType: string;
  status: string;
  createdAt: Date;
};

type FavoriteRow = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  ordered: number;
};

export function AccountHome({
  customer,
  firstName,
  lastName,
  createdAt,
  offersOptIn,
  orders,
  services,
  favorites,
  defaultLocation = "",
  locationLabel = "",
  referralLink = "",
  rewardReady = false
}: {
  customer: CustomerSession;
  firstName: string;
  lastName: string;
  createdAt: Date;
  offersOptIn: boolean;
  orders: OrderRow[];
  services: ServiceRow[];
  favorites: FavoriteRow[];
  defaultLocation?: string;
  locationLabel?: string;
  referralLink?: string;
  rewardReady?: boolean;
}) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || customer.name;

  return (
    <ProfileHub
      firstName={firstName}
      lastName={lastName}
      fullName={fullName}
      createdAt={createdAt}
      phone={customer.phone}
      email={customer.email ?? ""}
      offersOptIn={offersOptIn}
      orders={orders}
      services={services}
      favorites={favorites}
      defaultLocation={defaultLocation}
      locationLabel={locationLabel}
      referralLink={referralLink}
      rewardReady={rewardReady}
    />
  );
}
