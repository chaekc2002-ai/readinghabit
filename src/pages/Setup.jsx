import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupStudents, isSetupDone, isTeacherLoggedIn, getCurrentTeacherId } from '../utils/mockData';
import { Users, AlertCircle } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();
  const [count, setCount] = useState('');
  
  useEffect(() => {
    if (!isTeacherLoggedIn()) {
      navigate('/teacher/login');
      return;
    }
    
    const teacherId = getCurrentTeacherId();
    if (isSetupDone(teacherId)) {
      navigate('/teacher/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(count, 10);
    if (num > 0 && num <= 50) {
      const teacherId = getCurrentTeacherId();
      setupStudents(teacherId, num);
      navigate('/teacher/dashboard');
    } else {
      alert('학생 수는 1에서 50 사이의 숫자로 입력해주세요.');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <Users size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>학급 초기 설정</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
          우리 반 학생들의 독서 기록을 관리하기 위한 타이머를 생성합니다.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label htmlFor="studentCount">우리 반 총 학생 수</label>
            <input
              type="number"
              id="studentCount"
              className="input-field"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="예: 25"
              min="1"
              max="50"
              required
              autoFocus
              style={{ fontSize: '1.5rem', padding: '1rem', textAlign: 'center' }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', marginTop: '1rem' }}>
            학생 목록 생성하기
          </button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#ff9d97', fontSize: '0.9rem' }}>
          <AlertCircle size={16} />
          설정을 완료하면 현재 교사 계정의 이전 학생 데이터는 초기화됩니다.
        </div>
      </div>
    </div>
  );
}
