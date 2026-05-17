import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./studentApp/pages/Login";
import Register from "./studentApp/pages/Register";
import ForgotPassword from "./studentApp/pages/ForgotPassword";
import Dashboard from "./studentApp/pages/Dashboard";
import GigMarketplace from "./studentApp/pages/GigMarketplace";
import Applications from "./studentApp/pages/Applications";
import Messages from "./studentApp/pages/Messages";
import Reviews from "./studentApp/pages/Reviews";
import Settings from "./studentApp/pages/Settings";
import AlumniMentorship from "./studentApp/pages/AlumniMentorship";
import Profile from "./studentApp/pages/student/Profile";
import FindTalent from "./studentApp/pages/recruiter/FindTalent";
import ApplicantProfile from "./studentApp/pages/recruiter/ApplicantProfile";
import StudentLayout from "./studentApp/components/StudentLayout";
import AuthProvider from "./studentApp/components/AuthProvider";
import ProtectedRoute from "./studentApp/components/ProtectedRoute";

// Mentor Community Modules
import MentorsList from "./studentApp/pages/mentor/MentorsList";
import MentorProfile from "./studentApp/pages/mentor/MentorProfile";
import MentorDashboardHome from "./studentApp/pages/mentor/MentorDashboardHome";
import CommunityDiscussion from "./studentApp/pages/mentor/CommunityDiscussion";
import CommunityThreadView from "./studentApp/pages/mentor/CommunityThreadView";

const queryClient = new QueryClient();
const App = () => (<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <HotToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#000000',
          color: '#CCFF00',
          border: '1px solid #333333',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '14px',
          textTransform: 'uppercase',
        },
        success: {
          iconTheme: {
            primary: '#CCFF00',
            secondary: '#000000',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF003C',
            secondary: '#000000',
          },
        },
      }}
    />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Student App Routes with Neon Theme */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="gigs" element={<GigMarketplace />} />
              <Route path="applications" element={<Applications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
              <Route path="mentorship" element={<AlumniMentorship />} />
              <Route path="profile" element={<Profile />} />
              <Route path="find-talent" element={<FindTalent />} />
              <Route path="applicant/:id" element={<ApplicantProfile />} />
            </Route>
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route element={<StudentLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/mentors" element={<MentorsList />} />
              <Route path="/mentors/:id" element={<MentorProfile />} />
              <Route path="/mentor-dashboard" element={<MentorDashboardHome />} />
              <Route path="/mentor-dashboard/community" element={<CommunityDiscussion basePath="mentor-dashboard/community" />} />
              <Route path="/student-dashboard/community" element={<CommunityDiscussion basePath="student-dashboard/community" />} />
              <Route path="/community/:category" element={<CommunityDiscussion basePath="community" />} />
              <Route path="/community" element={<CommunityDiscussion basePath="community" />} />
              <Route path="/community/:category/:threadId" element={<CommunityThreadView />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
</QueryClientProvider>);
export default App;
