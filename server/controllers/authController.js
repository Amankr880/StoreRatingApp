const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateUser = require("../middlewares/validateUser");

exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const errors = validateUser({ name, email, password, address });
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (name, email, password, address, role)
                   VALUES (?, ?, ?, ?, 'user')`;

    db.query(query, [name, email, hashedPassword, address], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Email already exists" });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  });
};
