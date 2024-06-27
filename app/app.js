const express = require('express');
const mysql = require('mysql');
const { Etcd3 } = require('etcd3');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());

// Configuration MySQL
const db_config = {
  host: 'mysql',
  user: 'user',
  password: 'password',
  database: 'ticketdb'
};

// env var
const etcd_host = process.env.ETCD_HOST || 'localhost';
const redis_host = process.env.REDIS_HOST || 'localhost';

const connection = mysql.createConnection(db_config);

// Configuration etcd
const etcd = new Etcd3({ hosts: `nginx:2379` });

app.post('/reserve', async (req, res) => {
  const { event_id, user_id } = req.body;

  const lock = await etcd.lock('reservation_lock').acquire();

  connection.query('SELECT available_tickets FROM events WHERE event_id = ?', [event_id], (error, results) => {
    if (error) {
      lock.release();
      return res.status(500).json({ status: 'error', message: error });
    }
    if (results.length > 0 && results[0].available_tickets > 0) {
      const new_count = results[0].available_tickets - 1;
      connection.query('UPDATE events SET available_tickets = ? WHERE event_id = ?', [new_count, event_id], (error) => {
        if (error) {
          lock.release();
          return res.status(500).json({ status: 'error', message: error });
        }
        connection.query('INSERT INTO reservations (user_id, event_id) VALUES (?, ?)', [user_id, event_id], (error) => {
          lock.release();
          if (error) {
            return res.status(500).json({ status: 'error', message: error });
          }
          return res.json({ status: 'success' });
        });
      });
    } else {
      lock.release();
      return res.status(400).json({ status: 'failed', message: 'No tickets available' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
