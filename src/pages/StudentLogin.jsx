import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getTeacherIdByClassCode, getStudentsByTeacher } from '../utils/mockData';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { classCode } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

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
      alert('해당 교사의 학급 데이터가 없습니다. 선생님께 문의해주세요.');
      navigate('/');
      return;
    }

    setStudents(loadedUsers);
  }, [classCode, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      navigate(`/student/dashboard/${selectedStudent}`);
    } else {
      alert('본인의 이름을 선택해주세요.');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-outline" 
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} /> 홈으로
        </button>

        <LogIn size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
        
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>학생 개별 접속</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
          학급 코드: <strong>{classCode}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>내 이름 선택</label>
            <select 
              className="input-field" 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            >
              <option value="" disabled>-- 이름을 선택하세요 --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.displayName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            내 독서 기록장 들어가기
          </button>
        </form>
      </div>
    </div>
  );
}
