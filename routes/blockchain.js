const express = require('express');
const router = express.Router();
const Blockchain = require('../models/blockchain');

const blockchain = new Blockchain();


router.post('/add', async (req, res) => {
    try {
        const data = req.body; 
        const newBlock = await blockchain.addBlock(data);
        res.status(201).json({ message: 'Bloco adicionado com sucesso', block: newBlock });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao adicionar bloco', details: err.message });
    }
});


router.get('/consulta/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const block = await blockchain.getBlockByEstabelecimentoId(id);
        if (!block) return res.status(404).json({ message: 'Bloco não encontrado para esse estabelecimento' });

        res.json({ valid: block.hash.startsWith('000000'), block });
    } catch (err) {
        res.status(500).json({ error: 'Erro na consulta', details: err.message });
    }
});


router.get('/validar', async (req, res) => {
    try {
        const valid = await blockchain.isChainValid();
        res.json({ chainValid: valid });
    } catch (err) {
        res.status(500).json({ error: 'Erro na validação da blockchain', details: err.message });
    }
});

module.exports = router;
