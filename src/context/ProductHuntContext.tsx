import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ProductHuntContextType {
  isProductHunt: boolean;
}

const ProductHuntContext = createContext<ProductHuntContextType | undefined>(undefined);

export function ProductHuntProvider({ children }: { children: ReactNode }) {
  const [isProductHunt, setIsProductHunt] = useState(() => {
    return localStorage.getItem("isProductHunt") === "true";
  });
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/product-hunt") {
      setIsProductHunt(true);
      localStorage.setItem("isProductHunt", "true");
    }
  }, [location.pathname]);

  return (
    <ProductHuntContext.Provider value={{ isProductHunt }}>
      {children}
    </ProductHuntContext.Provider>
  );
}

export function useProductHunt() {
  const context = useContext(ProductHuntContext);
  if (context === undefined) {
    throw new Error("useProductHunt must be used within ProductHuntProvider");
  }
  return context;
}
