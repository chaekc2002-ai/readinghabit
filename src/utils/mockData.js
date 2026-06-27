// src/utils/mockData.js

const TEACHERS_KEY = 'reading_app_teachers';
const CURRENT_TEACHER_KEY = 'reading_app_current_teacher_id';
const USERS_KEY = 'reading_app_users';
const BOOKS_KEY = 'reading_app_books';
const USER_TIMERS_KEY = 'reading_app_user_timers';

// -- Teacher Auth --
export const registerTeacher = (id, password, name, classCode) => {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  if (teachers.find(t => t.id === id)) {
    return { success: false, message: '이미 존재하는 아이디입니다.' };
  }
  if (teachers.find(t => t.classCode === classCode)) {
    return { success: false, message: '이미 다른 선생님이 사용 중인 학급 코드입니다.' };
  }
  teachers.push({ id, password, name, classCode });
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  return { success: true };
};

export const loginTeacher = (id, password) => {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  const teacher = teachers.find(t => t.id === id && t.password === password);
  if (teacher) {
    localStorage.setItem(CURRENT_TEACHER_KEY, id);
    return { success: true };
  }
  return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
};

export const logoutTeacher = () => {
  localStorage.removeItem(CURRENT_TEACHER_KEY);
};

export const getCurrentTeacherId = () => {
  return localStorage.getItem(CURRENT_TEACHER_KEY);
};

export const isTeacherLoggedIn = () => {
  return !!getCurrentTeacherId();
};

export const getTeacherName = (id) => {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  const teacher = teachers.find(t => t.id === id);
  return teacher ? teacher.name : null;
};

export const getTeacherClassCode = (id) => {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  const teacher = teachers.find(t => t.id === id);
  return teacher ? teacher.classCode : null;
};

export const getTeacherIdByClassCode = (classCode) => {
  const teachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  const teacher = teachers.find(t => t.classCode === classCode);
  return teacher ? teacher.id : null;
};

// -- Student Management --
export const isSetupDone = (teacherId) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.some(u => u.teacherId === teacherId);
};

export const setupStudents = (teacherId, count) => {
  let allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  allUsers = allUsers.filter(u => u.teacherId !== teacherId);
  
  for (let i = 1; i <= count; i++) {
    allUsers.push({
      id: `${teacherId}_student${i}`,
      teacherId,
      displayName: `${i}번 학생`
    });
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
};

export const getStudentsByTeacher = (teacherId) => {
  const allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return allUsers.filter(u => u.teacherId === teacherId);
};

export const getStudent = (studentId) => {
  const allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return allUsers.find(u => u.id === studentId);
};

// -- Books Management --
export const getBooksByStudent = (studentId) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  return books.filter(b => b.userId === studentId);
};

export const getAllBooksByTeacher = (teacherId) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  const students = getStudentsByTeacher(teacherId).map(s => s.id);
  return books.filter(b => students.includes(b.userId));
};

export const addBook = (studentId, title) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  const newBook = {
    id: Date.now().toString(),
    userId: studentId,
    title,
    createdAt: new Date().toISOString()
  };
  books.push(newBook);
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  return newBook;
};

export const deleteBook = (bookId) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  const filtered = books.filter(b => b.id !== bookId);
  localStorage.setItem(BOOKS_KEY, JSON.stringify(filtered));
};

// -- Timer Management --
export const getAllTimersByTeacher = (teacherId) => {
  const allTimers = JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
  const students = getStudentsByTeacher(teacherId).map(s => s.id);
  
  const teacherTimers = {};
  students.forEach(id => {
    if (allTimers[id]) {
      teacherTimers[id] = allTimers[id];
    }
  });
  return teacherTimers;
};

export const getTimer = (studentId) => {
  const allTimers = JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
  return allTimers[studentId] || { totalSeconds: 0, lastStarted: null };
};

export const startTimer = (studentId) => {
  const allTimers = JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
  const timer = allTimers[studentId] || { totalSeconds: 0, lastStarted: null };
  if (!timer.lastStarted) {
    timer.lastStarted = new Date().toISOString();
    allTimers[studentId] = timer;
    localStorage.setItem(USER_TIMERS_KEY, JSON.stringify(allTimers));
  }
};

export const stopTimer = (studentId) => {
  const allTimers = JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
  const timer = allTimers[studentId] || { totalSeconds: 0, lastStarted: null };
  if (timer.lastStarted) {
    const start = new Date(timer.lastStarted);
    const end = new Date();
    const diffSecs = Math.round((end - start) / 1000);
    timer.totalSeconds += diffSecs;
    timer.lastStarted = null;
    allTimers[studentId] = timer;
    localStorage.setItem(USER_TIMERS_KEY, JSON.stringify(allTimers));
  }
};

export const clearTeacherData = (teacherId) => {
  let allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  allUsers = allUsers.filter(u => u.teacherId !== teacherId);
  localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  
  let books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  const remainingBooks = books.filter(b => !b.userId.startsWith(teacherId + '_'));
  localStorage.setItem(BOOKS_KEY, JSON.stringify(remainingBooks));
  
  let allTimers = JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
  const newTimers = {};
  Object.keys(allTimers).forEach(id => {
    if (!id.startsWith(teacherId + '_')) {
      newTimers[id] = allTimers[id];
    }
  });
  localStorage.setItem(USER_TIMERS_KEY, JSON.stringify(newTimers));
};
