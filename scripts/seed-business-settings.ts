import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function seedBusinessSettings() {
  const { connectToDatabase } =
    await import("@/lib/mongodb");

  const { default: BusinessSettings } =
    await import(
      "@/models/BusinessSettings"
    );

  await connectToDatabase();

  await BusinessSettings.deleteMany({});

  const settings =
    await BusinessSettings.create({
      businessName: "Khans Food",

      timezone: "America/Toronto",
      
      sameDayCutoffTime: "17:00",

      weeklyHours: {
        sunday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        monday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        tuesday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        wednesday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        thursday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        friday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },

        saturday: {
          isOpen: true,
          openingTime: "11:00",
          closingTime: "20:00",
        },
      },
    });

  console.log(
    "Business settings seeded:",
    settings._id.toString()
  );

  process.exit(0);
}

seedBusinessSettings().catch(
  (error) => {
    console.error(
      "Unable to seed business settings:",
      error
    );

    process.exit(1);
  }
);