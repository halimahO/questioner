import db from '../db';
import 'babel-polyfill';

const Meetup = {
  async getAllMeetups(req, res) {
    const findAllQuery = 'SELECT * FROM meetups ORDER BY id ASC';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({
        status: 200,
        message: rows,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  async getOneMeetup(req, res) {
    const text = 'SELECT * FROM meetups WHERE id = $1';
    const id = parseInt(req.params.id, 10);
    try {
      const { rows } = await db.query(text, [id]);
      if (rows.length === 0) {
        return res.status(404).send({
          status: 400,
          message: 'meetup not found',
        });
      }
      return res.status(200).send({
        status: 200,
        message: rows[0],
      });
    } catch (error) {
      return res.status(400).send({ message: 'Id must be a number' });
    }
  },

  async getUpcoming(req, res) {
    const findAllQuery = 'SELECT * FROM meetups WHERE happening_on >= Now()';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      if (!rows) {
        return res.status(404).send({ message: 'no upcoming meetups' });
      }
      return res.status(200).send({
        status: 200,
        message: rows,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  async createMeetup(req, res) {
    const text = `INSERT INTO
      meetups(location, images, topic, happening_on, tags)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      req.body.location,
      req.body.images,
      req.body.topic,
      req.body.happeningOn,
      req.body.tags,
    ];
    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send({
        status: 200,
        message: rows[0],
      });
    } catch (error) {
      return res.status(400).send({ message: 'Invalid date type, please use the format yyyy/mm/dd' });
    }
  },

  async createRsvps(req, res) {
    const text = `INSERT INTO
      rsvp(response)
      VALUES($1)`;
    const id = parseInt(req.params.id, 10);

    try {
      const { rows } = await db.query(text, [id]);
      return res.status(201).send({
        status: 200,
        message: rows,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

};
export default Meetup;
