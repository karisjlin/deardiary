import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { AccountPage } from "./pages/AccountPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { PostDetailPage } from "./pages/PostDetailPage";

const ProtectedApp = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

export const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/app" replace /> : <LandingPage />} />
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/posts/:postId" element={<PostDetailPage />} />
      <Route path="/app" element={<ProtectedApp />}>
        <Route index element={<HomePage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="d/:name" element={<CommunityPage />} />
      </Route>
    </Routes>
  );
};
