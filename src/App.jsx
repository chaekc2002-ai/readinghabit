import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import TeacherLogin from './pages/TeacherLogin';
import Setup from './pages/Setup';
import MainBoard from './pages/MainBoard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import { isTeacherLoggedIn } from './utils/mockData';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/login" element={
              isTeacherLoggedIn() ? <Navigate to="/teacher/dashboard" replace /> : <TeacherLogin />
            } />
            <Route path="/teacher/setup" element={<Setup />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

            {/* Student Timer Board (Kiosk) */}
            <Route path="/board/:classCode" element={<MainBoard />} />
            
            {/* Student Individual Dashboard */}
            <Route path="/student/login/:classCode" element={<StudentLogin />} />
            <Route path="/student/dashboard/:studentId" element={<StudentDashboard />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
