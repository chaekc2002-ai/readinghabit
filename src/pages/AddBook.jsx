import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, addBook, getBooksByStudent } from '../utils/mockData';
import { BookPlus, ArrowLeft } from 'lucide-react';

export default function AddBook() {
  const navigate = useNavigate();
  const { teacherId, studentId } = useParams();
  
  const [student, setStudent] = useState(null);
  const [title, setTitle] = useState('');
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    const s = getStudent(studentId);
    if (!s) {
      navigate(`/board/${teacherId}`);
      return;
    }
    setStudent(s);
    setRecentBooks(getBooksByStudent(studentId));
  }, [studentId, teacherId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addBook(studentId, title.trim());
      navigate(`/board/${teacherId}`);
    }
  };

  if (!student) return null;

  return (
    <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%' }}>
        <button 
          onClick={() => navigate(`/board/${teacherId}`)} 
          className="btn btn-outline" 
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} /> 보드로 돌아가기
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookPlus size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2><span style={{ color: 'var(--color-primary)' }}>{student.displayName}</span>의 독서 기록</h2>
          <p style={{ color: 'var(--color-text-light)' }}>방금 읽은 책 제목을 기록해보세요!</p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="책 제목을 입력하세요"
              required
              autoFocus
              style={{ fontSize: '1.2rem', padding: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', marginTop: '1rem' }}>
            기록하기
          </button>
        </form>

        {recentBooks.length > 0 && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>최근 읽은 책</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[...recentBooks].reverse().slice(0, 3).map(book => (
                <li key={book.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '500' }}>{book.title}</span>
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(book.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
