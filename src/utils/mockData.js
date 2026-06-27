// src/utils/mockData.js

const USERS_KEY = 'reading_app_users';
const BOOKS_KEY = 'reading_app_books';
const USER_TIMERS_KEY = 'reading_app_user_timers';
const SETUP_DONE_KEY = 'reading_app_setup_done';

export const isSetupDone = () => {
  return localStorage.getItem(SETUP_DONE_KEY) === 'true';
};

export const setupStudents = (count) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `student${i}`,
      displayName: `${i}번 학생`
    });
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(BOOKS_KEY, JSON.stringify([]));
  localStorage.setItem(USER_TIMERS_KEY, JSON.stringify({}));
  localStorage.setItem(SETUP_DONE_KEY, 'true');
};

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const getBooksByUser = (userId) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  return books.filter(b => b.userId === userId);
};

export const getAllBooks = () => {
  return JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
};

export const addBook = (userId, title) => {
  const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  const newBook = {
    id: Date.now().toString(),
    userId,
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

export const clearAllData = () => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(BOOKS_KEY);
  localStorage.removeItem(USER_TIMERS_KEY);
  localStorage.removeItem(SETUP_DONE_KEY);
};

export const getAllTimers = () => {
  return JSON.parse(localStorage.getItem(USER_TIMERS_KEY) || '{}');
};

export const getTimer = (userId) => {
  const timers = getAllTimers();
  return timers[userId] || { totalSeconds: 0, lastStarted: null };
};

export const startTimer = (userId) => {
  const timers = getAllTimers();
  const timer = timers[userId] || { totalSeconds: 0, lastStarted: null };
  if (!timer.lastStarted) {
    timer.lastStarted = new Date().toISOString();
    timers[userId] = timer;
    localStorage.setItem(USER_TIMERS_KEY, JSON.stringify(timers));
  }
};

export const stopTimer = (userId) => {
  const timers = getAllTimers();
  const timer = timers[userId] || { totalSeconds: 0, lastStarted: null };
  if (timer.lastStarted) {
    const start = new Date(timer.lastStarted);
    const end = new Date();
    const diffSecs = Math.round((end - start) / 1000);
    timer.totalSeconds += diffSecs;
    timer.lastStarted = null;
    timers[userId] = timer;
    localStorage.setItem(USER_TIMERS_KEY, JSON.stringify(timers));
  }
};
