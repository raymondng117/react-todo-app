const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*'
};

app.use(cors(corsOptions));

const connection = mysql.createConnection({
  host: process.env.NGROK_HOST,
  port: process.env.NGROK_PORT,
  user: process.env.DB_CONNECTION_USER,
  password: process.env.DB_CONNECTION_USERPASSWORD,
  database: process.env.DB_CONNECTION_DATABASE
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

function keepDatabaseAlive() {
  connection.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error executing keep-alive query:', err);
    } else {
      console.log('Database connection is alive');
    }
  });
}

setInterval(keepDatabaseAlive, 150000); 


app.post('/signup', (req, res) => {
  const { username, useremail, password } = req.body;
  console.log({username, useremail, password });
  connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, useremail, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('Email already exists');
        res.status(400).json({signedup: false, error: 'Email already exists' });
      } else {
        console.error('Error querying database:', err);
        res.status(500).json({signedup: false, error: 'Internal Server Error' });
      }
      return;
    }

    if (result.insertId > 0) {
      console.log('User created with id:', result.insertId);
      res.json({ signedup: true});
    } else {
      console.log('Invalid email or password');
      res.json({ signedup: false, error: 'Invalid email or password' });
    }
  });
});


app.post('/login', (req, res) => {
  const { useremail, password } = req.body;
  console.log({ useremail, password });
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [useremail, password], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.length > 0) {
      console.log('User authenticated:', result[0]);
      res.json({ authenticated: true, user: result[0] });
    } else {
      console.log('Invalid email or password');
      res.json({ authenticated: false });
    }
  });
});


app.get('/todolist/:userid', (req, res) => {
  const userid = req.params.userid;
  connection.query('SELECT list_id, list_name FROM todolists WHERE user_id = ?', [userid], (err, results) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      res.json(results);
      console.log(results);
    } else {
      console.log("No results");
      res.status(404).send("No results found for the user ID");
    }
  });
});

app.post('/todolist/:userid', (req, res) => {
  const userid = req.params.userid; 
  const listname = req.body.listname; 

  connection.query('INSERT INTO todolists (list_name, user_id) VALUES (?, ?)', [listname, userid], (err, results) => {
      if (err) {
          console.error('Error adding list item:', err);
          res.status(500).send('Internal Server Error');
          return;
      }
      const newListId = results.insertId; 
      res.status(201).json({ newListId });
  });
});


app.delete('/todolist/:userid/:listid', (req, res) => {
  const userid = req.params.userid; 
  const listid = req.params.listid; 

  connection.query('DELETE FROM todolists WHERE user_id = ? AND list_id = ?', [userid, listid], (err, results) => {
    if (err) {
      console.error('Error deleting list item:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.affectedRows > 0) {
      res.json({ message: 'List item deleted successfully' });
    } else {
      res.status(404).send('List item not found for the user ID and list name');
    }
  });
});

app.get('/todoitem/:userid/:listid', (req, res) => {
  const userid = req.params.userid;
  const listid = req.params.listid;

  connection.query('SELECT item_id, item_name, status, due_date, complete_date FROM todoitems WHERE list_id = ? AND user_id = ?', [listid, userid], (err, results) => {
    if (err) {
      console.error('Error retrieving todo items:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      res.json(results);
      console.log(results);
    } else {
      console.log("No results");
      res.status(404).send("No results found for the list name and user ID");
    }
  });
});

app.post('/todoitem/:userid/:listid/:itemname', (req, res) => {
  const userid = req.params.userid;
  const listid = req.params.listid;
  const itemname = req.params.itemname;

  connection.query('INSERT INTO todoitems (item_name, list_id, user_id) VALUES (?, ?, ?)', [itemname, listid, userid], (err, results) => {
      if (err) {
          console.error('Error adding todo items:', err);
          res.status(500).send('Internal Server Error');
          return;
      } else {
          if (results && results.insertId) {
              const newItemId = results.insertId; 
              console.log('New item ID:', newItemId);
              res.status(201).json({ newItemId });
          } else {
              console.error('Failed to get insertId from results:', results);
              res.status(500).send('Internal Server Error');
          }
      }
  });
});


app.delete('/todoitem/:itemid', (req, res) => {
  const itemid = req.params.itemid;

  connection.query('DELETE FROM todoitems where item_id = ?', [itemid], (err, results) => {
    if (err) {
      console.error('Error adding todo items:', err);
      res.status(500).send('Internal Server Error');
      return;
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/todoitem/:itemid', (req, res) => {
  const itemid = req.params.itemid;

  connection.query('SELECT * FROM todoitems where item_id = ?', [itemid], (err, results) => {
    if (err) {
      console.error('Error adding todo items:', err);
      res.status(500).send('Internal Server Error');
      return;
    } 

    if (results.length > 0) {
      res.json(results);
    } else {
      console.log("No results");
      res.status(404).send("No results found for the item");
    }
  });
});

app.put('/todoitem/:itemid', (req, res) => {
  const itemId = req.params.itemid;
  const itemName = req.body.item_name;
  const status = req.body.status;
  const dueDate = req.body.due_date;
  const completeDate = req.body.complete_date;

  const sql = 'UPDATE todoitems SET item_name = ?, status = ?, due_date = ?, complete_date = ? WHERE item_id = ?';

  connection.query(sql, [itemName, status, dueDate, completeDate, itemId], (error, results) => {
      if (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Error updating data');
      } else {
          console.log('Data updated successfully');
          res.status(200).send('Data updated successfully');
      }
  });
});

const port = 8080;
app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
});









