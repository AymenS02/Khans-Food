// app/menu/page.tsx

import getMenuItems from "@/features/menu/actions/getMenuItems";
// import MenuGrid from "@/features/menu/components/MenuGrid";

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <main className="container mx-auto py-10">
      {/* <MenuGrid items={items} /> */}
    </main>
  );
}