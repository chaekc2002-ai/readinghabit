import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Setup from './pages/Setup';
import MainBoard from './pages/MainBoard';
import AddBook from './pages/AddBook';
import TeacherDashboard from './pages/TeacherDashboard';
import { isSetupDone } from './utils/mockData';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={isSetupDone() ? "/board" : "/setup"} replace />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/board" element={<MainBoard />} />
            <Route path="/add-book/:studentId" element={<AddBook />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
