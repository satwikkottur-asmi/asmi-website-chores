import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";
import { RootLayout } from "./routes/__root";
import Index from "./routes/index";
import Privacy from "./routes/privacy";
import TermsAndConditions from "./routes/terms-and-conditions";
import ProductHunt from "./routes/product-hunt";
import { ProductHuntProvider } from "./context/ProductHuntContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProductHuntProvider>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/product-hunt" element={<ProductHunt />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Route>
          </Routes>
        </ProductHuntProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
