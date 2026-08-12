import { ProductHuntLinks } from "./MessagingLinks";

interface Props {
  size?: "md" | "lg";
}

export function CTASection({ size = "lg" }: Props) {
  return <ProductHuntLinks size={size} />;
}
