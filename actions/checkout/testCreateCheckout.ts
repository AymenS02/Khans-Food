import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function test() {
  const { createCheckout } = await import("./createCheckout");

  const result = await createCheckout({
    items: [
      {
        menuItemId: "6a793bc5c24a58dda1f73034",
        quantity: 2,
      },
    ],

    pickupDate: "2099-08-15",
    pickupTime: "14:00",

    firstName: "Test",
    lastName: "Customer",

    email: "test@example.com",
    phone: "9055555555",

    notes: "Test order",
  });

  console.log(result);
}

test().catch(console.error);