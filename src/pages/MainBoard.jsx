import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentsByTeacher, getTimer, startTimer, stopTimer, getTeacherIdByClassCode } from '../utils/mockData';
import { Play, Square, Clock, ArrowLeft } from 'lucide-react';

export default function MainBoard() {
  const navigate = useNavigate();
  const { classCode } = useParams();
  const [users, setUsers] = useState([]);
  const [timers, setTimers] = useState({});
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!classCode) {
      navigate('/');
      return;
    }
    
    const teacherId = getTeacherIdByClassCode(classCode);
    if (!teacherId) {
      alert('존재하지 않는 학급 코드입니다.');
      navigate('/');
      return;
    }
    
    const loadedUsers = getStudentsByTeacher(teacherId);
    if (loadedUsers.length === 0) {
      alert('해당 교사의 학급 데이터가 없습니다. 교사 계정에서 초기 설정을 진행해주세요.');
      navigate('/');
      return;
    }

    setUsers(loadedUsers);
    
    const fetchTimers = () => {
      const currentTimers = {};
      loadedUsers.forEach(u => {
        currentTimers[u.id] = getTimer(u.id);
      });
      setTimers(currentTimers);
    };
    
    fetchTimers();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [classCode, navigate]);

  const handleToggleTimer = (userId, isRunning) => {
    if (isRunning) {
      stopTimer(userId);
    } else {
      startTimer(userId);
    }
    setTimers(prev => ({...prev, [userId]: getTimer(userId)}));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-outline" 
            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} /> 홈으로
          </button>
          <h1 style={{ color: 'var(--color-primary)' }}>학급 타이머 보드</h1>
          <p style={{ color: 'var(--color-text-light)' }}>학급 코드: <strong>{classCode}</strong></p>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-light)' }}>
          {now.toLocaleTimeString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {users.map(user => {
          const timer = timers[user.id] || { totalSeconds: 0, lastStarted: null };
          const isRunning = !!timer.lastStarted;
          
          let elapsedSecs = 0;
          if (isRunning) {
            elapsedSecs = Math.floor((now - new Date(timer.lastStarted)) / 1000);
          }
          const currentTotalSecs = timer.totalSeconds + elapsedSecs;
          const displayMins = Math.floor(currentTotalSecs / 60);
          const displaySecs = currentTotalSecs % 60;

          return (
            <div key={user.id} className={`card ${isRunning ? 'timer-active' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1.4rem' }}>{user.displayName}</strong>
                <Clock size={24} style={{ opacity: isRunning ? 1 : 0.3 }} />
              </div>
              
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', margin: '1rem 0', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                {displayMins}<span style={{ fontSize: '1.2rem', fontWeight: 'normal', margin: '0 4px' }}>분</span>
                {displaySecs}<span style={{ fontSize: '1.2rem', fontWeight: 'normal', marginLeft: '4px' }}>초</span>
              </div>

              <div style={{ display: 'flex', marginTop: 'auto' }}>
                <button 
                  onClick={() => handleToggleTimer(user.id, isRunning)} 
                  className={`btn ${isRunning ? '' : 'btn-primary'}`} 
                  style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', background: isRunning ? '#ff6b6b' : '', color: isRunning ? 'white' : '' }}
                >
                  {isRunning ? <Square size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> : <Play size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
                  {isRunning ? '종료' : '시작'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
