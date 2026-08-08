import { formatPrice } from "@/lib/utils/formatPrice";
import { generateSlug } from "@/lib/utils/generateSlug";
import { generateOrderNumber } from "@/lib/utils/generateOrderNumber";

export default function HomePage() {
  return (
    <main>
      <p>{formatPrice(14.99)}</p>

      <p>{generateSlug("Chicken Biryani")}</p>

      <p>{generateOrderNumber()}</p>
    </main>
  );
}