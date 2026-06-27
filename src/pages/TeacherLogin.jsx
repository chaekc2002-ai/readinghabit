import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginTeacher, registerTeacher } from '../utils/mockData';
import { LogIn, UserPlus } from 'lucide-react';

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = loginTeacher(id, password);
      if (res.success) {
        navigate('/teacher/dashboard');
      } else {
        setError(res.message);
      }
    } else {
      if (!name) {
        setError('이름을 입력해주세요.');
        return;
      }
      const res = registerTeacher(id, password, name);
      if (res.success) {
        loginTeacher(id, password);
        navigate('/teacher/dashboard');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        {isLogin ? (
          <LogIn size={48} color="var(--color-secondary)" style={{ margin: '0 auto 1.5rem' }} />
        ) : (
          <UserPlus size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
        )}
        
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          {isLogin ? '교사 로그인' : '교사 회원가입'}
        </h1>

        {error && (
          <div style={{ color: '#ff6b6b', background: '#ffebeb', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label>이름 (선생님 성함)</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                required={!isLogin}
              />
            </div>
          )}
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label>아이디 (학급 코드로 사용됨)</label>
            <input
              type="text"
              className="input-field"
              value={id}
              onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              placeholder="영문, 숫자만 입력"
              required
            />
            <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>* 이 아이디를 학생들이 입력하여 보드에 접속합니다.</small>
          </div>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>비밀번호</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`btn ${isLogin ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', marginBottom: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            {isLogin ? '로그인' : '가입하기'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: '#888' }}>
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isLogin ? '가입하기' : '로그인하기'}
          </button>
        </p>
      </div>
    </div>
  );
}
