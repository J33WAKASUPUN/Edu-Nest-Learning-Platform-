
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import AdminHomePage from './pages/adminPage';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register';
import ProductPage from './client/productPage';
import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';

import Enroll from './pages/enroll';
import ScienceSubjects from './pages/subjects/scienceSubjects';
import TechnologySubjects from './pages/subjects/technologySubjects';
import ArtSubjects from './pages/subjects/artSubjects';
import { ToastContainer } from 'react-toastify';
import ArtSessions from './pages/subjects/arts/artSessions';
import ArtNotes from './pages/subjects/arts/artNotes';
import ScienceSessions from './pages/subjects/science/sicenceSessions';
import ScienceNotes from './pages/subjects/science/sicenceNotes';
import TechSessions from './pages/subjects/technology/techSessions';
import TechNotes from './pages/subjects/technology/techNotes';
import StaffLogin from './pages/staffLogin';
import SubjectsPage from './pages/subjects';
import MyLearningPage from './pages/myLearning';
import SchedulePage from './pages/calendar';

function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Toaster position="top-center" />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/calender" element={<SchedulePage />} />
        {/* <Route path="/products" element={<ProductPage />} /> */}
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/admin/*" element={<AdminHomePage />} />
        <Route path="/*" element={<Home />} />

        <Route path="/arts-subjects" element={<ArtSubjects />} />
        {/* Routes for Art Sessions and Notes */}
        <Route path="/art/artSessions" element={<ArtSessions />} />
        <Route path="/art/artNotes" element={<ArtNotes />} />

        <Route path="/science-subjects" element={<ScienceSubjects />} />
        <Route path="/science/scienceSessions" element={<ScienceSessions />} />
        <Route path="/science/scienceNotes" element={<ScienceNotes />} />

        <Route path="/technology-subjects" element={<TechnologySubjects />} />
        <Route path="/technology/techSessions" element={<TechSessions />} />
        <Route path="/technology/techNotes" element={<TechNotes />} />

        <Route path="/enroll" element={<Enroll />} />
        <Route path="/staff-login" element={<StaffLogin />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;