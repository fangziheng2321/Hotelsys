import { FacilityId } from "@/enum/facility";
import { FacilityItem } from "@/types";

// 设施常量
export const HOTEL_FACILITIES: FacilityItem[] = [
  { id: FacilityId.WIFI, name: "facility.wifi", icon: "wifi" },
  { id: FacilityId.PARKING, name: "facility.parking", icon: "parking" },
  {
    id: FacilityId.RESTAURANT,
    name: "facility.restaurant",
    icon: "restaurant",
  },
  { id: FacilityId.GYM, name: "facility.gym", icon: "gym" },
  { id: FacilityId.POOL, name: "facility.pool", icon: "pool" },
  { id: FacilityId.MEETING, name: "facility.meeting", icon: "meeting" },
];
