import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
  async register(req, res) {
    try {
      const { FirstName, LastName, MiddleName, email, phone } = req.body;
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const token = jwt.sign(
        {
          _id: email,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );
      const isUniqEMail = await pool.query(`SELECT * FROM person WHERE email=$1`, [email]);
      if (isUniqEMail.rows.length === 0) {
        const query = await pool.query(
          `INSERT INTO person (FirstName, LastName, MiddleName, password, email, phone) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [FirstName, LastName, MiddleName, hash, email, phone],
        );
        res.json({ user: query.rows[0], token });
      } else {
        res.json({ message: 'Пользователь с таким E-mail существует' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Не удалось зарегистрироваться!' });
    }
  }

  async login(req, res) {
    try {
      const { email } = req.body;
      const password = req.body.password.toString();
      const user = await pool.query(`SELECT * FROM person WHERE email = $1`, [email]);
      if (!user.rows[0]) {
        return res.json({ message: 'Неверный логин / пароль' });
      }
      const hash = user.rows[0].password;
      const isValidHash = await bcrypt.compare(password, hash);
      if (!isValidHash) {
        return res.json({ message: 'Неверный логин / пароль' });
      }
      const token = jwt.sign(
        {
          _id: email,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );
      res.json({ user: user.rows[0], token: token });
    } catch (err) {
      res.status(500).json({ message: 'Не удалось авторизоваться!' });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const delWork = await pool.query(`DELETE FROM work WHERE user_id = $1`, [id]);
      const query = await pool.query(`DELETE FROM person WHERE id = $1`, [id]);
      res.json({ message: 'Учетая запись успешно удаленна' });
    } catch (err) {
      res.status(500).json({ message: 'Не удалось удалить учетную запись попробуйте позже' });
    }
  }
  async getMe(req, res) {
    try {
      const email = req.email;
      const query = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
      res.json({ user: query.rows[0] });
      console.log(email);
    } catch (err) {
      res.status(500).json({ message: 'Нет доступа!!!', err: err });
    }
  }

  async updateUser(req, res) {
    try {
      const { id, FirstName, LastName, MiddleName, password, email, phone, chart } = req.body;
      const query = await pool.query(
        `UPDATE person SET FirstName = $1, LastName = $2, MiddleName= $3, password = $4, email = $5, phone = $6 WHERE id = $7 RETURNING *`,
        [FirstName, LastName, MiddleName, password, email, phone, id],
      );
      res.json({ user: query.rows[0] });
    } catch (err) {
      res.status(500).json({ message: 'Не удалось обновить информацию о пользователе' });
    }
  }
}

export default new UserController();
