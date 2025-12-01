import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { StudiosPage } from "./pages/StudioPage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { ArtistDetailPage } from "./pages/ArtistsDetailPage";
import { BookAppointmentPage } from "./pages/BookAppointmentPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudioDetailPage } from "./pages/StudioDetailPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";
import { ArtistDashboardPage } from "./pages/ArtistsDashboardPage";
import { AdminStylesPage } from "./pages/AdminStylesPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminStudiosPage } from "./pages/AdminStudioPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StudioDashboardPage } from "./pages/StudioDashboardPage";
import { StudioArtistsPage } from "./pages/StudioArtistsPage";
import { StudioCreatePage } from "./pages/StudioCreatePage";
import { AdminStudioCreatePage } from "./pages/AdminStudioCreatePage";
import { AdminStudioEditPage } from "./pages/AdminStudioEditPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/studios", element: <StudiosPage /> },
      { path: "/studios/:id", element: <StudioDetailPage /> },
      { path: "/studios/dashboard", element: <StudioDashboardPage /> },
      { path: "/studios/artists", element: <StudioArtistsPage /> },
      { path: "/studios/create", element: <StudioCreatePage /> },

      { path: "/artists", element: <ArtistsPage /> },
      { path: "/artists/:id", element: <ArtistDetailPage /> },
      { path: "/artists/:id/book", element: <BookAppointmentPage /> },

      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      { path: "/me/appointments", element: <MyAppointmentsPage /> },
      { path: "/me/artist/appointments", element: <ArtistDashboardPage /> },
      { path: "/me", element: <ProfilePage /> },

      { path: "/admin/styles", element: <AdminStylesPage /> },
      { path: "/admin/users", element: <AdminUsersPage /> },
      { path: "/admin/studios", element: <AdminStudiosPage /> },
      { path: "/admin/studios/create", element: <AdminStudioCreatePage /> },
      { path: "/admin/studios/edit/:id", element: <AdminStudioEditPage /> },
    ],
  },
]);
