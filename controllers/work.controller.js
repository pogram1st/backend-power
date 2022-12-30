import pool from '../db.js';
import moment from 'moment/moment.js';

class WorkController {
  async getWork(req, res) {
    const user_id = req.query.id;
    const { dateFrom, dateTo } = req.body;
    const query = await pool.query(`SELECT * FROM work WHERE user_id=${user_id}`);
    const a = query.rows.filter(
      (obj) =>
        Date.parse(moment.utc(obj.chislo).format('MM-DD-YYYY')) >= Date.parse(dateFrom) &&
        Date.parse(moment.utc(obj.chislo).format('MM-DD-YYYY')) <= Date.parse(dateTo),
    );
    res.json(a);
    try {
    } catch (err) {
      res.status(500).json({ message: 'Не удалось получить данные о работе' });
    }
  }
  async addWork(req, res) {
    try {
      const { data, time, user_id } = req.body;

      const query = await pool.query(
        'INSERT INTO work (time, chislo, user_id) values ($1, $2, $3) RETURNING *',
        [time, data, user_id],
      );
      res.json(query.rows);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Не удалось отправить данные о работе, обратитесь в поддержку', err });
    }
  }
}
export default new WorkController();
