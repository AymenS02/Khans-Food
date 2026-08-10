import { validatePickup } from "./validatePickup";
import { BusinessHours } from "../types/businessHours";

const businessHours: BusinessHours = {
  isOpen: true,
  openingTime: "10:00",
  closingTime: "18:00",
  cutoffTime: "17:00",
};

async function test() {
  const tests = [
    {
      name: "Valid future pickup",
      pickupDate: "2099-08-15",
      pickupTime: "14:00",
    },

    {
      name: "Missing date",
      pickupDate: "",
      pickupTime: "14:00",
    },

    {
      name: "Missing time",
      pickupDate: "2099-08-15",
      pickupTime: "",
    },

    {
      name: "Invalid date",
      pickupDate: "not-a-date",
      pickupTime: "14:00",
    },

    {
      name: "Past pickup",
      pickupDate: "2020-01-01",
      pickupTime: "14:00",
    },

    {
      name: "Before opening",
      pickupDate: "2099-08-15",
      pickupTime: "09:00",
    },

    {
      name: "After closing",
      pickupDate: "2099-08-15",
      pickupTime: "19:00",
    },
  ];

  for (const testCase of tests) {
    const result = validatePickup({
      pickupDate: testCase.pickupDate,
      pickupTime: testCase.pickupTime,
      businessHours,
    });

    console.log(testCase.name);
    console.log(result);
    console.log("--------------------");
  }
}

test().catch(console.error);