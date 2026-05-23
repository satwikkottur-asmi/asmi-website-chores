import { useProductHunt } from "@/context/ProductHuntContext";
import { WaitlistForm } from "./WaitlistForm";
import { ProductHuntLinks } from "./ProductHuntLinks";

interface Props {
  size?: "md" | "lg";
}

export function CTASection({ size = "lg" }: Props) {
  const { isProductHunt } = useProductHunt();

  return isProductHunt ? (
    <ProductHuntLinks size={size} />
  ) : (
    <WaitlistForm size={size} />
  );
}
