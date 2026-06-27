import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { isTeacherLoggedIn, logoutTeacher, getTeacherName, getCurrentTeacherId } from '../utils/mockData';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBoardMode = location.pathname.startsWith('/board');
  const loggedIn = isTeacherLoggedIn();

  const handleLogout = () => {
    logoutTeacher();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <BookOpen size={28} />
          <span>우당탕탕 독서 기록장</span>
        </Link>
        <nav className="nav-links">
          {isBoardMode ? (
            <Link to="/" className="nav-link">홈으로</Link>
          ) : (
            <>
              {loggedIn ? (
                <>
                  <span style={{ color: 'var(--color-text-light)', marginRight: '1rem' }}>
                    {getTeacherName(getCurrentTeacherId())} 선생님
                  </span>
                  <Link to="/teacher/dashboard" className="nav-link">대시보드</Link>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem' }}>
                    <LogOut size={16} /> 로그아웃
                  </button>
                </>
              ) : (
                <Link to="/teacher/login" className="nav-link">교사 로그인</Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
