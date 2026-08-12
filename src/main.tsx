import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import { ProductHuntProvider } from "./context/ProductHuntContext";
import { RootLayout } from "./routes/__root";
import Index from "./routes/index";
import NewNumber from "./routes/new-number";
import Privacy from "./routes/privacy";
import ProductHunt from "./routes/product-hunt";
import TermsAndConditions from "./routes/terms-and-conditions";

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
              <Route path="/new-number" element={<NewNumber />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Route>
          </Routes>
        </ProductHuntProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
