import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminGate } from "./pages/admin/AdminGate";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminProductEditor } from "./pages/admin/AdminProductEditor";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminOrderDetail } from "./pages/admin/AdminOrderDetail";
import { AdminInquiries } from "./pages/admin/AdminInquiries";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { NotFoundPage } from "./pages/NotFoundPage";

interface AppProps {
  amplifyConfigured: boolean;
  stripeCheckoutUrl: string;
}

function Wrap({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function App({ amplifyConfigured, stripeCheckoutUrl }: AppProps) {
  return (
    <AppContextProvider
      amplifyConfigured={amplifyConfigured}
      stripeCheckoutUrl={stripeCheckoutUrl}
    >
      <div className="paper-grain min-h-screen">
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin" element={<AdminGate />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductEditor />} />
            <Route path="products/:id" element={<AdminProductEditor />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/admin-redirect" element={<Wrap><Navigate to="/admin" replace /></Wrap>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
}
