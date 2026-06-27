import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import TeacherLogin from './pages/TeacherLogin';
import Setup from './pages/Setup';
import MainBoard from './pages/MainBoard';
import AddBook from './pages/AddBook';
import TeacherDashboard from './pages/TeacherDashboard';
import { isTeacherLoggedIn, isSetupDone, getCurrentTeacherId } from './utils/mockData';

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

            {/* Student Board Routes */}
            <Route path="/board/:teacherId" element={<MainBoard />} />
            <Route path="/board/:teacherId/add-book/:studentId" element={<AddBook />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
