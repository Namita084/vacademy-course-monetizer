import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CourseCreation from "./pages/CourseCreation";
import InstituteSettings from "./pages/InstituteSettings";
import InvitePage from "./pages/InvitePage";
import NotFound from "./pages/NotFound";
import StudentInvitePage from "./pages/StudentInvitePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course-creation" element={<CourseCreation />} />
          <Route path="/institute-settings" element={<InstituteSettings />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/invite/student/:inviteId" element={<StudentInvitePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
