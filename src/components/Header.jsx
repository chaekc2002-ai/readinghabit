import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';
import { isSetupDone } from '../utils/mockData';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <BookOpen color="var(--color-primary)" />
          행복 독서 보드
        </Link>
        <nav className="nav-links">
          {isSetupDone() && (
            <Link to="/teacher" className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>
              <Settings size={18} style={{ marginRight: '0.5rem' }} /> 교사용 관리
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
