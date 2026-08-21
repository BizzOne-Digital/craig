import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from '../admin/components/ProtectedRoute.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const AboutPage = lazy(() => import('../pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('../pages/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('../pages/ServiceDetailPage.jsx'));
const ShopPage = lazy(() => import('../pages/ShopPage.jsx'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage.jsx'));
const CartPage = lazy(() => import('../features/cart/CartPage.jsx'));
const BookingPage = lazy(() => import('../pages/BookingPage.jsx'));
const TeamPage = lazy(() => import('../pages/TeamPage.jsx'));
const PricingPage = lazy(() => import('../pages/PricingPage.jsx'));
const BlogPage = lazy(() => import('../pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('../pages/BlogPostPage.jsx'));
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'));
const TestimonialsPage = lazy(() => import('../pages/TestimonialsPage.jsx'));
const FAQPage = lazy(() => import('../pages/FAQPage.jsx'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('../pages/TermsPage.jsx'));
const ShippingReturnsPage = lazy(() => import('../pages/ShippingReturnsPage.jsx'));
const DisclaimerPage = lazy(() => import('../pages/DisclaimerPage.jsx'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage.jsx'));
const OrderCancelPage = lazy(() => import('../pages/OrderCancelPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const AdminLoginPage = lazy(() => import('../admin/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('../admin/AdminDashboardPage.jsx'));
const AdminProductsPage = lazy(() => import('../admin/AdminProductsPage.jsx'));
const AdminProductFormPage = lazy(() => import('../admin/AdminProductFormPage.jsx'));
const AdminServicesPage = lazy(() => import('../admin/AdminServicesPage.jsx'));
const AdminServiceFormPage = lazy(() => import('../admin/AdminServiceFormPage.jsx'));
const AdminOrdersPage = lazy(() => import('../admin/AdminOrdersPage.jsx'));
const AdminOrderDetailPage = lazy(() => import('../admin/AdminOrderDetailPage.jsx'));
const AdminTestimonialsPage = lazy(() => import('../admin/AdminTestimonialsPage.jsx'));
const AdminTestimonialFormPage = lazy(() => import('../admin/AdminTestimonialFormPage.jsx'));

function PageLoader() {
  return (
    <div className="container-jlf section-padding space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function SuspenseWrap({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          index
          element={
            <SuspenseWrap>
              <HomePage />
            </SuspenseWrap>
          }
        />
        <Route
          path="about"
          element={
            <SuspenseWrap>
              <AboutPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="services"
          element={
            <SuspenseWrap>
              <ServicesPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="services/:slug"
          element={
            <SuspenseWrap>
              <ServiceDetailPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="shop"
          element={
            <SuspenseWrap>
              <ShopPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="shop/:slug"
          element={
            <SuspenseWrap>
              <ProductDetailPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="cart"
          element={
            <SuspenseWrap>
              <CartPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="booking"
          element={
            <SuspenseWrap>
              <BookingPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="team"
          element={
            <SuspenseWrap>
              <TeamPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="pricing"
          element={
            <SuspenseWrap>
              <PricingPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="blog"
          element={
            <SuspenseWrap>
              <BlogPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="blog/:slug"
          element={
            <SuspenseWrap>
              <BlogPostPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="contact"
          element={
            <SuspenseWrap>
              <ContactPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="testimonials"
          element={
            <SuspenseWrap>
              <TestimonialsPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="faq"
          element={
            <SuspenseWrap>
              <FAQPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="privacy"
          element={
            <SuspenseWrap>
              <PrivacyPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="terms"
          element={
            <SuspenseWrap>
              <TermsPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="shipping-returns"
          element={
            <SuspenseWrap>
              <ShippingReturnsPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="disclaimer"
          element={
            <SuspenseWrap>
              <DisclaimerPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="order/success"
          element={
            <SuspenseWrap>
              <OrderSuccessPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="order/cancel"
          element={
            <SuspenseWrap>
              <OrderCancelPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="*"
          element={
            <SuspenseWrap>
              <NotFoundPage />
            </SuspenseWrap>
          }
        />
      </Route>

      <Route
        path="/admin/login"
        element={
          <SuspenseWrap>
            <AdminLoginPage />
          </SuspenseWrap>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <SuspenseWrap>
              <AdminDashboardPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="products"
          element={
            <SuspenseWrap>
              <AdminProductsPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="products/new"
          element={
            <SuspenseWrap>
              <AdminProductFormPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="products/:id/edit"
          element={
            <SuspenseWrap>
              <AdminProductFormPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="services"
          element={
            <SuspenseWrap>
              <AdminServicesPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="services/new"
          element={
            <SuspenseWrap>
              <AdminServiceFormPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="services/:id/edit"
          element={
            <SuspenseWrap>
              <AdminServiceFormPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="orders"
          element={
            <SuspenseWrap>
              <AdminOrdersPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="orders/:id"
          element={
            <SuspenseWrap>
              <AdminOrderDetailPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="testimonials"
          element={
            <SuspenseWrap>
              <AdminTestimonialsPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="testimonials/new"
          element={
            <SuspenseWrap>
              <AdminTestimonialFormPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="testimonials/:id/edit"
          element={
            <SuspenseWrap>
              <AdminTestimonialFormPage />
            </SuspenseWrap>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
