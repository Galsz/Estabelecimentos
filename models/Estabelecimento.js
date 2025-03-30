const mongoose = require('mongoose');

const EstabelecimentoSchema = new mongoose.Schema({
  nome: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  }
});

EstabelecimentoSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Estabelecimento', EstabelecimentoSchema);
