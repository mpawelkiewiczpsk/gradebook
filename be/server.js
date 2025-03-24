require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const DB_PATH = process.env.DB_PATH || './dziennik.db';

if (!SECRET_KEY) {
    console.error('Błąd: SECRET_KEY nie jest ustawiony w pliku .env');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z bazą SQLite (plikowa baza danych)
const db = new sqlite3.Database(DB_PATH, (err) => {
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
                                                  weight INTEGER,
                                                  FOREIGN KEY(studentId) REFERENCES users(id)
        )`);

    // Sprawdzenie, czy tabela users jest pusta
    db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row.count === 0) {
            // Dodajemy 10 uczniów
            const insertUser = db.prepare(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`);
            for (let i = 1; i <= 10; i++) {
                insertUser.run(`uczen${i}`, 'pass', 'student');
            }
            // Dodajemy 3 nauczycieli
            for (let i = 1; i <= 3; i++) {
                insertUser.run(`nauczyciel${i}`, 'pass', 'teacher');
            }
            // Dodajemy 2 adminów
            for (let i = 1; i <= 2; i++) {
                insertUser.run(`admin${i}`, 'pass', 'admin');
            }
            insertUser.finalize();

            // Dodajemy oceny:
            // Dla każdego z 6 przedmiotów dodajemy 5 ocen dla losowego ucznia (id od 1 do 10)
            const subjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Historia', 'Geografia'];
            subjects.forEach((subject) => {
                for (let i = 0; i < 5; i++) {
                    // Losowa ocena z zakresu 2-6
                    const grade = Math.floor(Math.random() * 5) + 2;
                    // Losowy uczeń z id 1-10
                    const studentId = Math.floor(Math.random() * 10) + 1;
                    const weight = Math.floor(Math.random() * 5) + 1;
                    db.run(
                        `INSERT INTO grades (studentId, subject, grade, weight) VALUES (?, ?, ?, ?)`,
                        [studentId, subject, grade, weight]
                    );
                }
            });
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
    const { username, password} = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd serwera' });
        }
        if (row) {
            // Tworzymy token zawierający id, username i role
            const token = jwt.sign({ id: row.id, username: row.username, role: row.role, weight: row.weight }, SECRET_KEY);
            const role = row.role;
            res.json({ token, role});
        } else {
            res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }
    });
});

app.get('/students', (req, res) => {
    // const { id ,username, role} = req.body;
    db.all(`SELECT id,username FROM users WHERE role = ?`, ["student"],(err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd serwera' });
        }
        res.json(rows);
    });
});

// Pobieranie użytkowników
app.get('/users', (req, res) => {
    // const { id ,username, role} = req.body;
    db.all(`SELECT id,username,role FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd serwera' });
        }
        res.json(rows);
    });
});


//dodawanie użytkowników
app.post('/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Brak uprawnień do dodawania użytkowników' });
    }
    const { username, password, role } = req.body;
  
    db.run(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, password, role],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Błąd serwera lub nazwa użytkownika zajęta' });
        }
        // Return the newly created user
        db.get(`SELECT id, username, role FROM users WHERE id = ?`, [this.lastID], (err, newUser) => {
          if (err) return res.status(500).json({ message: 'Błąd serwera' });
          res.json(newUser);
        });
      }
    );
  });

// Endpoint pobierania ocen
app.get('/grades', authenticateToken, (req, res) => {
    if (req.user.role === 'student') {
        // Uczeń widzi tylko swoje oceny
        db.all(`SELECT * FROM grades WHERE studentId = ?`, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Błąd serwera' });
            res.json(rows);
        });
    } else if (req.user.role === 'teacher' || req.user.role === 'admin') {
        // Nauczyciel i admin widzą wszystkie oceny
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

    const { studentId, subject, grade, weight } = req.body;
    db.run(`INSERT INTO grades (studentId, subject, grade, weight) VALUES (?, ?, ?, ?)`, [studentId, subject, grade, weight], function(err) {
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
