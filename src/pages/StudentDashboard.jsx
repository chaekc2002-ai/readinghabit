import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, addBook, getBooksByStudent, getTimer } from '../utils/mockData';
import { BookPlus, ArrowLeft, Clock, BookOpen } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  
  const [student, setStudent] = useState(null);
  const [title, setTitle] = useState('');
  const [recentBooks, setRecentBooks] = useState([]);
  const [timer, setTimer] = useState({ totalSeconds: 0 });

  useEffect(() => {
    const s = getStudent(studentId);
    if (!s) {
      navigate('/');
      return;
    }
    setStudent(s);
    setRecentBooks(getBooksByStudent(studentId));
    setTimer(getTimer(studentId));
  }, [studentId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addBook(studentId, title.trim());
      setRecentBooks(getBooksByStudent(studentId));
      setTitle('');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (!student) return null;

  const displayMins = Math.floor(timer.totalSeconds / 60);
  const displaySecs = timer.totalSeconds % 60;

  return (
    <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%' }}>
        <button 
          onClick={handleLogout} 
          className="btn btn-outline" 
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} /> 로그아웃 (초기화면)
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-primary)' }}>{student.displayName}</span>의 독서 기록장
          </h2>
          <p style={{ color: 'var(--color-text-light)' }}>내가 읽은 책들을 기록하고 관리하세요!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card text-center" style={{ padding: '1rem' }}>
            <Clock size={24} color="var(--color-teacher)" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)' }}>내 누적 독서 시간</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-teacher)' }}>
              {displayMins}분 {displaySecs}초
            </div>
          </div>
          <div className="card text-center" style={{ padding: '1rem' }}>
            <BookOpen size={24} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)' }}>지금까지 읽은 책</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {recentBooks.length}권
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookPlus size={20} color="var(--color-secondary)" /> 새 책 기록하기
          </h3>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="다 읽은 책 제목을 입력하세요"
              required
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', marginTop: '1rem' }}>
            기록 추가하기
          </button>
        </form>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '1rem' }}>내 독서 목록</h3>
          {recentBooks.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[...recentBooks].reverse().map(book => (
                <li key={book.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fdfdfd', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                  <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>{book.title}</span>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(book.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#aaa', background: '#f8f8f8', borderRadius: '8px' }}>
              아직 기록된 책이 없습니다. 첫 책을 기록해 보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
