const crypto = require('crypto');
const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    index: Number,
    timestamp: String,
    data: mongoose.Schema.Types.Mixed, 
    previousHash: String,
    hash: String,
    nonce: Number
});

const BlockModel = mongoose.model('Block', blockSchema, 'blockchain');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.difficulty = 6;
    }

    async getLatestBlock() {
        const latest = await BlockModel.findOne().sort({ index: -1 });
        return latest;
    }

    async addBlock(data) {
        const latest = await this.getLatestBlock();
        const index = latest ? latest.index + 1 : 0;
        const previousHash = latest ? latest.hash : '0';
        const timestamp = new Date().toISOString();

        const newBlock = new Block(index, timestamp, data, previousHash);
        newBlock.mineBlock(this.difficulty);

        const savedBlock = new BlockModel(newBlock);
        await savedBlock.save();
        return savedBlock;
    }

    async isChainValid() {
        const blocks = await BlockModel.find().sort({ index: 1 });

        for (let i = 1; i < blocks.length; i++) {
            const current = blocks[i];
            const previous = blocks[i - 1];

            const hashCheck = crypto.createHash('sha256')
                .update(current.index + current.timestamp + JSON.stringify(current.data) + current.previousHash + current.nonce)
                .digest('hex');

            if (current.hash !== hashCheck || current.previousHash !== previous.hash) {
                return false;
            }
        }

        return true;
    }

    async getBlockByEstabelecimentoId(id) {
        const block = await BlockModel.findOne({ "data.id": id });
        return block;
    }
}

module.exports = Blockchain;
