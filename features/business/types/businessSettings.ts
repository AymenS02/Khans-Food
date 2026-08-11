export interface DayHours {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export interface BusinessSettingsData {
  id: string;

  businessName: string;
  timezone: string;

  sameDayCutoffTime: string;

  weeklyHours: {
    sunday: DayHours;
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
  };
}