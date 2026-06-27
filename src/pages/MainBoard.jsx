import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getTimer, startTimer, stopTimer, isSetupDone } from '../utils/mockData';
import { Play, Square, BookPlus, Clock } from 'lucide-react';

export default function MainBoard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [timers, setTimers] = useState({});
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!isSetupDone()) {
      navigate('/setup');
      return;
    }
    
    const loadedUsers = getAllUsers();
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
  }, [navigate]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>독서 타이머 보드</h1>
          <p style={{ color: 'var(--color-text-light)' }}>내 번호를 찾아 독서 시간을 기록해보세요!</p>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-light)' }}>
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
            <div key={user.id} className={`card ${isRunning ? 'timer-active' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.2rem' }}>{user.displayName}</strong>
                <Clock size={20} style={{ opacity: isRunning ? 1 : 0.3 }} />
              </div>
              
              <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', margin: '1rem 0', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                {displayMins}<span style={{ fontSize: '1rem', fontWeight: 'normal', margin: '0 4px' }}>분</span>
                {displaySecs}<span style={{ fontSize: '1rem', fontWeight: 'normal', marginLeft: '4px' }}>초</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  onClick={() => handleToggleTimer(user.id, isRunning)} 
                  className={`btn ${isRunning ? '' : 'btn-primary'}`} 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '1rem', background: isRunning ? '#ff6b6b' : '', color: isRunning ? 'white' : '' }}
                >
                  {isRunning ? <Square size={16} /> : <Play size={16} />}
                  {isRunning ? '종료' : '시작'}
                </button>
                <button 
                  onClick={() => navigate(`/add-book/${user.id}`)}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem', borderColor: isRunning ? 'rgba(255,255,255,0.5)' : 'var(--color-secondary)', color: isRunning ? 'white' : 'var(--color-text)' }}
                  title="책 기록하기"
                >
                  <BookPlus size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
