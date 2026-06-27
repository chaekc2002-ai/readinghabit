import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, LogIn } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState('');

  const handleJoinBoard = (e) => {
    e.preventDefault();
    if (teacherId.trim()) {
      navigate(`/board/${teacherId.trim()}`);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
        <BookOpen size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>독서 타이머 보드</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          환영합니다! 어떤 모드로 시작할까요?
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="card" style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
            <Users size={32} color="var(--color-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>교사용 (관리자)</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
              학급을 생성하고 학생들의 독서 기록과 타이머 통계를 확인하세요.
            </p>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={() => navigate('/teacher/login')}
            >
              교사 로그인 / 가입
            </button>
          </div>
          
          <div className="card" style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
            <LogIn size={32} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>학생용 (키오스크)</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
              교실 앞 전자칠판에 띄워두고 학생 스스로 독서 시간을 기록하세요.
            </p>
            <form onSubmit={handleJoinBoard}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="선생님 아이디(학급 코드)" 
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                required
                style={{ marginBottom: '1rem', width: '100%' }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                보드 입장하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
