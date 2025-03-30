const express = require('express');
const router = express.Router();
const Estabelecimento = require('../models/Estabelecimento');

router.post('/', async (req, res) => {
  const { nome, latitude, longitude } = req.body;

  const nearby = await Estabelecimento.findOne({
    location: {
      $nearSphere: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: 2000
      }
    }
  });

  if (nearby) {
    return res.status(400).send("Já existe um estabelecimento em um raio menor que 2km.");
  }

  const novo = new Estabelecimento({
    nome,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  });

  await novo.save();
  res.status(201).send("Estabelecimento cadastrado com sucesso!");
});


router.get('/', async (req, res) => {
  const estabelecimentos = await Estabelecimento.find();
  res.json(estabelecimentos);
});

module.exports = router;
