const express = require('express'); // express server; this is a constructor
// const { v4: uuidv4 } = require('uuid');
const app = express(); // the constructor to create an app

const {
  PORT = 3000,
  // MONGODB_URI="mongodb://localhost/cars_jump"
} = process.env;

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cars',
  // password: 'password',
  port: 5432,
});

app.use(express.static('public')); // is it inside thisfolder and use; the order of app uses matter
app.use(express.json()); // all json is properly passed

app.get('/api/v1/cars/:id?', (req, res) => {
  const { id } = req.params;

  // If you want to change the order: /api/v1/cars
  const { searchField = 'id', searchDirection = 'ASC' } = req.query;

  console.log('id', id);

  // GET all cars
  const QUERY = 'SELECT * FROM cars';
  let SORT = '';
  let CASE = '';
  if (id) {
    CASE = ` WHERE id = ${id}`;
  } else {
    SORT = ` ORDER BY ${searchField} ${searchDirection}`; // only sort if multiple
  }
  const fullQuery = `${QUERY}${CASE}${SORT}`;
  console.log('fullQuery', fullQuery);
  pool.query(fullQuery, (error, results) => {
    if (error) {
      // throw error;
      console.log(error);
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows);
  });
});

app.get('/api/v1/cars/join/owner', (req, res) => {
  const QUERY = 'SELECT * FROM cars AS T1';
  let JOIN = ' LEFT JOIN owners AS T2 ON T1.owner = T2.id'; // try changing 'LEFT' for 'RIGHT"

  const fullQuery = `${QUERY}${JOIN}`;
  console.log('fullQuery', fullQuery);

  pool.query(fullQuery, (error, results) => {
    if (error) {
      // throw error;
      console.log(error);
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows);
  });
});

// CREATE
app.post('/api/v1/cars', (req, res) => {
  console.log('Adding', req.body);
  const fields = Object.keys(req.body); // again, doing this for the whole of req.body is a bad idea. re.body.data would be a better place to put it.
  const columns = fields.join(', ');
  const values = [];
  for (const field of fields) {
    const value = req.body[field];
    if (value) {
      values.push(value);
    }
  }
  const fullQuery = `INSERT INTO cars (${columns}) VALUES (${values
    .map((v, i) => `$${i + 1}`)
    .join(', ')}) RETURNING *`;
  console.log('fullQuery', fullQuery);
  console.log('values', values);
  pool.query(fullQuery, values, (error, results) => {
    if (error) {
      console.log('err', error);
      return res.status(500).send(error);
    }
    console.log('results', results);
    res.status(201).send(results.rows[0]);
  });
});

// UPDATE
app.put('/api/v1/cars/:id', (req, res) => {
  const { id: carId } = req.params;

  const data = req.body;

  const keys = Object.keys(data);
  // console.log('keys', keys);

  // 'UPDATE cars SET name = $1, email = $2 WHERE id = $3'

  let setStr = ''; // to do this bit: name = $1, email = $2

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      setStr += `${key} = '${data[key]}', `; // <-- like this
    }
  }
  setStr = setStr.slice(0, -2); // 'remove final comma and space
  const query = `UPDATE cars SET ${setStr} WHERE id = ${carId} RETURNING *`;

  console.log('full query', query);

  pool.query(query, (error, results) => {
    if (error) {
      // throw error; // don't throw the error or you'll crash the app! XD
      console.log(error);
      return res.status(500).send(error);
    }
    console.log('results', results);
    res.status(200).json(results.rows[0]);
  });
});

// Delete
app.delete('/api/v1/cars/:id', (req, res) => {
  const { id: carId } = req.params;

  // console.log('carToBeDeleted', carId);
  pool.query('DELETE FROM cars WHERE id = $1', [carId], (error) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).send(`User deleted with ID: ${carId}`);
  });
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// CAR
// id  name             bhp          owner
// 1   ferrari          300            6*

// OWNERS
// id  firstname     lastname
// 6*    fred          bloggs

// CARS REPORT
// id  firstname     lastname    make             bhp          owner
// 6*    fred          bloggs     ferrari          300            6
