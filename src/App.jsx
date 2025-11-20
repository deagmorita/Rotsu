import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ContactPage from "./pages/contactpage";
import EditProfilePage from "./pages/EditProfilePage";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import ScrollToTop from "./pages/ScrollToTop";
import HonestReviewPage from "./pages/HonestReviewPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./pages/SangPelindungRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/order/:id" element={<OrderDetailPage />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} />
                  <Route path="/settings" element={<EditProfilePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/review" element={<HonestReviewPage />} />
                </Routes>
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
