import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addBook, getAllUsers } from '../utils/mockData';
import { BookPlus } from 'lucide-react';

export default function AddBook() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const users = getAllUsers();
    const student = users.find(u => u.id === studentId);
    if (!student) {
      alert('잘못된 접근입니다.');
      navigate('/board');
      return;
    }
    setStudentName(student.displayName);
  }, [studentId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addBook(studentId, title.trim());
      navigate('/board');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <BookPlus size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>새 책 기록하기</h2>
          <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            [{studentName}]
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="title">다 읽은 책 제목을 입력하세요</label>
            <input
              type="text"
              id="title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 어린 왕자"
              required
              autoFocus
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/board')} className="btn btn-outline" style={{ flex: 1 }}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!title.trim()}>
              기록 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
