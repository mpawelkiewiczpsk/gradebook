const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const SECRET_KEY = 'twoj_klucz_tajemny'; // Zmień na swój bezpieczny klucz

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z bazą SQLite (plikowa baza danych: dziennik.db)
const db = new sqlite3.Database('./dziennik.db', (err) => {
    if (err) {
        console.error('Błąd przy otwieraniu bazy danych:', err.message);
    } else {
        console.log('Połączono z bazą SQLite.');
    }
});

// Utworzenie tabel, jeśli nie istnieją oraz dodanie przykładowych danych
db.serialize(() => {
    // Tabela użytkowników
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

    // Tabela ocen
    db.run(`CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER,
    subject TEXT,
    grade INTEGER,
    FOREIGN KEY(studentId) REFERENCES users(id)
  )`);

    // Dodanie przykładowych użytkowników oraz ocen, jeśli tabela jest pusta
    db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row.count === 0) {
            const insertUser = db.prepare(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`);
            insertUser.run('uczen', 'pass', 'student');
            insertUser.run('nauczyciel', 'pass', 'teacher');
            insertUser.finalize();

            // Dodanie przykładowej oceny dla ucznia (zakładamy, że uczeń ma id = 1)
            db.run(`INSERT INTO grades (studentId, subject, grade) VALUES (?, ?, ?)`, [1, 'Matematyka', 5]);
        }
    });
});

// Middleware do weryfikacji tokena JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Endpoint logowania
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd serwera' });
        }
        if (row) {
            // Tworzymy token zawierający id, username i role
            const token = jwt.sign({ id: row.id, username: row.username, role: row.role }, SECRET_KEY);
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }
    });
});

// Endpoint pobierania ocen
app.get('/grades', authenticateToken, (req, res) => {
    if (req.user.role === 'student') {
        // Uczeń widzi tylko swoje oceny
        db.all(`SELECT * FROM grades WHERE studentId = ?`, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Błąd serwera' });
            res.json(rows);
        });
    } else if (req.user.role === 'teacher') {
        // Nauczyciel widzi wszystkie oceny
        db.all(`SELECT * FROM grades`, (err, rows) => {
            if (err) return res.status(500).json({ message: 'Błąd serwera' });
            res.json(rows);
        });
    } else {
        res.sendStatus(403);
    }
});

// Endpoint dodawania ocen (tylko dla nauczyciela)
app.post('/grades', authenticateToken, (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Brak uprawnień do dodania ocen' });
    }

    const { studentId, subject, grade } = req.body;
    db.run(`INSERT INTO grades (studentId, subject, grade) VALUES (?, ?, ?)`, [studentId, subject, grade], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Błąd serwera' });
        }
        // Pobranie nowo dodanej oceny
        db.get(`SELECT * FROM grades WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) return res.status(500).json({ message: 'Błąd serwera' });
            res.json(row);
        });
    });
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
