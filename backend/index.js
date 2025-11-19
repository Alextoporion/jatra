const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const UserController = require('./routes/UserRoute');
const PurchaseRoute = require('./routes/PurchaseRoute');
const ProductionRoute = require('./routes/ProductionRoute');
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api', UserController);
app.use('/api', PurchaseRoute);
app.use('/api', ProductionRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
