const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const estabelecimentosRouter = require('./routes/estabelecimentos');
app.use('/api/estabelecimentos', estabelecimentosRouter);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
