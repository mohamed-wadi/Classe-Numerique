const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, '..', 'data');
const TEACHER_FILE = path.join(DATA_DIR, 'teacher.json');
const RESET_FILE = path.join(DATA_DIR, 'teacher_reset.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadTeacher() {
  try {
    ensureDataDir();
    if (fs.existsSync(TEACHER_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TEACHER_FILE, 'utf8'));
      return parsed;
    }
  } catch {}
  return null;
}

function saveTeacher(teacher) {
  ensureDataDir();
  fs.writeFileSync(TEACHER_FILE, JSON.stringify(teacher, null, 2));
}

async function setTeacherCredentials(username, passwordPlain) {
  const hashed = await bcrypt.hash(passwordPlain, 10);
  const teacher = { username, passwordHash: hashed, updatedAt: new Date().toISOString() };
  saveTeacher(teacher);
  return teacher;
}

function getReset() {
  try {
    ensureDataDir();
    if (!fs.existsSync(RESET_FILE)) return null;
    const parsed = JSON.parse(fs.readFileSync(RESET_FILE, 'utf8'));
    if (!parsed || !parsed.code || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function initReset(code, ttlMinutes = 15) {
  ensureDataDir();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const payload = { code, expiresAt };
  fs.writeFileSync(RESET_FILE, JSON.stringify(payload, null, 2));
  return payload;
}

function clearReset() {
  try {
    if (fs.existsSync(RESET_FILE)) fs.unlinkSync(RESET_FILE);
  } catch {}
}

module.exports = {
  loadTeacher,
  saveTeacher,
  setTeacherCredentials,
  getReset,
  initReset,
  clearReset,
};


