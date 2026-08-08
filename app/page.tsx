import { connectToDatabase } from "@/lib/mongodb";

export default async function HomePage() {
  await connectToDatabase();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">
        Khans Food
      </h1>
    </main>
  );
}