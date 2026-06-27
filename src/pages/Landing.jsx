import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, LogIn, Monitor } from 'lucide-react';
import { getTeacherIdByClassCode } from '../utils/mockData';

export default function Landing() {
  const navigate = useNavigate();
  const [boardCode, setBoardCode] = useState('');
  const [studentCode, setStudentCode] = useState('');

  const handleJoinBoard = (e) => {
    e.preventDefault();
    if (boardCode.trim()) {
      const teacherId = getTeacherIdByClassCode(boardCode.trim());
      if (teacherId) {
        navigate(`/board/${boardCode.trim()}`);
      } else {
        alert('존재하지 않는 학급 코드입니다.');
      }
    }
  };

  const handleJoinStudent = (e) => {
    e.preventDefault();
    if (studentCode.trim()) {
      const teacherId = getTeacherIdByClassCode(studentCode.trim());
      if (teacherId) {
        navigate(`/student/login/${studentCode.trim()}`);
      } else {
        alert('존재하지 않는 학급 코드입니다.');
      }
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
        <BookOpen size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>우당탕탕 독서 기록장</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          환영합니다! 원하시는 메뉴를 선택하세요.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Monitor size={32} color="var(--color-teacher)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>타이머 보드 (전자칠판용)</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
              교실 앞 전자칠판에 띄워두고 학생들의 독서 타이머를 시작하세요.
            </p>
            <form onSubmit={handleJoinBoard}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="학급 코드 입력" 
                value={boardCode}
                onChange={(e) => setBoardCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                required
                style={{ marginBottom: '1rem', width: '100%' }}
              />
              <button type="submit" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--color-teacher)', color: 'var(--color-teacher)' }}>
                보드 입장하기
              </button>
            </form>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <LogIn size={32} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>개별 기록장 (학생용)</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
              내 스마트폰/태블릿으로 내가 읽은 책을 직접 기록하고 확인하세요.
            </p>
            <form onSubmit={handleJoinStudent}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="학급 코드 입력" 
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                required
                style={{ marginBottom: '1rem', width: '100%' }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                내 기록장 입장
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
