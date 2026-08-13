import { Outlet } from "react-router-dom";
import { CanvasesProvider } from "@/components/app/useCanvases";

export default function AppLayout() {
  return (
    <CanvasesProvider>
      <Outlet />
    </CanvasesProvider>
  );
}
