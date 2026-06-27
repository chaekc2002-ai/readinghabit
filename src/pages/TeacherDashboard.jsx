import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getAllBooksByTeacher, 
  getStudentsByTeacher, 
  getAllTimersByTeacher, 
  clearTeacherData,
  isTeacherLoggedIn,
  getCurrentTeacherId,
  getTeacherName,
  getTeacherClassCode,
  updateClassCode,
  deleteBook
} from '../utils/mockData';
import { BarChart3, Users, Clock, AlertTriangle, Download, ChevronDown, ChevronUp, Book, ExternalLink, Edit2, Check, X, Trash2 } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [timers, setTimers] = useState({});
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classCode, setClassCode] = useState('');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editCodeInput, setEditCodeInput] = useState('');

  useEffect(() => {
    if (!isTeacherLoggedIn()) {
      navigate('/teacher/login');
      return;
    }
    const tId = getCurrentTeacherId();
    setTeacherId(tId);
    setTeacherName(getTeacherName(tId));
    setClassCode(getTeacherClassCode(tId));
    fetchData(tId);
  }, [navigate]);

  const fetchData = (tId) => {
    setBooks(getAllBooksByTeacher(tId));
    setUsers(getStudentsByTeacher(tId));
    setTimers(getAllTimersByTeacher(tId));
  };

  const handleClearData = () => {
    if (window.confirm('경고: 우리 반 학생들의 데이터가 초기화되고 학생 수 설정 화면으로 이동합니다. 정말 초기화하시겠습니까?')) {
      clearTeacherData(teacherId);
      navigate('/teacher/setup');
    }
  };

  const handleExport = () => {
    let csv = '학생번호,총독서시간(초),책제목,기록일자\n';
    
    users.forEach(student => {
      const studentBooks = books.filter(b => b.userId === student.id);
      const studentTimer = timers[student.id]?.totalSeconds || 0;
      
      if (studentBooks.length === 0) {
        csv += `${student.displayName},${studentTimer},,\n`;
      } else {
        studentBooks.forEach(b => {
          csv += `${student.displayName},${studentTimer},"${b.title}",${new Date(b.createdAt).toLocaleDateString()}\n`;
        });
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${teacherName}_reading_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const totalSecs = users.reduce((sum, u) => sum + (timers[u.id]?.totalSeconds || 0), 0);
    const totalBks = books.length;
    return {
      studentCount: users.length,
      totalSeconds: totalSecs,
      totalBooks: totalBks
    };
  }, [users, timers, books]);

  const toggleStudent = (studentId) => {
    setExpandedStudentId(prev => prev === studentId ? null : studentId);
  };

  const handleSaveClassCode = () => {
    if (!editCodeInput.trim()) return;
    const res = updateClassCode(teacherId, editCodeInput.trim());
    if (res.success) {
      setClassCode(editCodeInput.trim());
      setIsEditingCode(false);
    } else {
      alert(res.message);
    }
  };

  const handleDeleteBook = (bookId, title) => {
    if (window.confirm(`'${title}' 독서 기록을 정말 삭제하시겠습니까?`)) {
      deleteBook(bookId);
      setBooks(getAllBooksByTeacher(teacherId));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>{teacherName} 선생님 대시보드</h1>
          <div style={{ color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>우리 반 전체 학생의 통계를 한눈에 확인하세요. (학급 코드:</span>
            {isEditingCode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input 
                  type="text" 
                  value={editCodeInput} 
                  onChange={(e) => setEditCodeInput(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} 
                  style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="영문,숫자"
                  autoFocus
                />
                <button onClick={handleSaveClassCode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Check size={18} /></button>
                <button onClick={() => setIsEditingCode(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b6b' }}><X size={18} /></button>
              </div>
            ) : (
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {classCode} 
                <button onClick={() => { setEditCodeInput(classCode); setIsEditingCode(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }} title="학급 코드 변경">
                  <Edit2 size={14} />
                </button>
              </strong>
            )}
            <span>)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link to={`/board/${classCode}`} target="_blank" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ExternalLink size={18} /> 학생 보드 열기
          </Link>
          <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> CSV 내보내기
          </button>
          <button onClick={handleClearData} className="btn btn-outline" style={{ color: '#ff6b6b', borderColor: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> 학급 재설정
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card text-center">
          <Users size={32} color="#8CE071" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--color-text-light)' }}>설정된 학생 수</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8CE071' }}>
            {stats.studentCount} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>명</span>
          </div>
        </div>
        <div className="card text-center">
          <Clock size={32} color="var(--color-teacher)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--color-text-light)' }}>학급 누적 독서 시간</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-teacher)' }}>
            {Math.floor(stats.totalSeconds / 60)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>분</span> {stats.totalSeconds % 60} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>초</span>
          </div>
        </div>
        <div className="card text-center">
          <BarChart3 size={32} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--color-text-light)' }}>전체 읽은 책</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {stats.totalBooks} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>권</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', background: '#fcfcfc' }}>
          <h2 style={{ margin: 0 }}>학생별 상세 기록</h2>
        </div>
        
        {users.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', padding: '3rem 0', textAlign: 'center' }}>
            등록된 학생이 없습니다. 초기 설정을 진행해주세요.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map(student => {
              const studentTimerSec = timers[student.id]?.totalSeconds || 0;
              const sMins = Math.floor(studentTimerSec / 60);
              const sSecs = studentTimerSec % 60;
              const studentBooks = books.filter(b => b.userId === student.id);
              const isExpanded = expandedStudentId === student.id;

              return (
                <div key={student.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div 
                    onClick={() => toggleStudent(student.id)}
                    style={{ 
                      padding: '1.5rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isExpanded ? '#f9f9f9' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{student.displayName}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--color-text-light)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} /> {sMins}분 {sSecs}초
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '60px' }}>
                        <Book size={16} /> {studentBooks.length}권
                      </span>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ padding: '1.5rem', background: '#fdfdfd', borderTop: '1px solid #f5f5f5' }}>
                      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>읽은 책 목록</h4>
                      {studentBooks.length === 0 ? (
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>아직 등록된 책이 없습니다.</p>
                      ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {[...studentBooks].reverse().map(book => (
                            <li key={book.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: book.review ? '0.5rem' : '0' }}>
                                <span style={{ fontWeight: '500' }}>{book.title}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{new Date(book.createdAt).toLocaleDateString()}</span>
                                  <button onClick={() => handleDeleteBook(book.id, book.title)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.2rem', display: 'flex' }} title="기록 삭제">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              {book.review && (
                                <div style={{ fontSize: '0.9rem', color: '#555', background: '#f9f9f9', padding: '0.8rem', borderRadius: '6px', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                                  {book.review}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
