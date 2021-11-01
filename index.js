const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running from Ummah Food Delivery Server')
})

app.listen(port, (req, res) => {
    console.log('Server Runnig at Port', port);
})