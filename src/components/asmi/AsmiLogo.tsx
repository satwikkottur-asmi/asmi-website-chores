import { cn } from "@/lib/utils";
import asmiLogoUrl from "/assets/asmi-logo-black-tight.png";

/**
 * asmi wordmark, tightly cropped (no transparent padding).
 * - Intrinsic `width`/`height` = the PNG's pixel size → reserves aspect ratio before load (no layout shift)
 * - Display size comes from `className` (e.g. `h-5 md:h-6`); width follows via `w-auto`
 */
export function AsmiLogo({ className }: { className?: string }) {
  return (
    <img src={asmiLogoUrl} alt="asmi" width={174} height={65} className={cn("w-auto", className)} />
  );
}
