const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// MongoDB 连接
mongoose.connect('mongodb://localhost:27017/codes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// 定义模式和模型
const codeSchema = new mongoose.Schema({
    name: String,
    code: String
});

const Code = mongoose.model('Code', codeSchema);

// 中间件
app.use(bodyParser.json());

// 生成随机代号
function generateRandomCode() {
    const letters = ['C', 'A', 'XS', 'S'];
    const probabilities = [85, 12, 2, 1];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let letterIndex = 0;
    let cumulativeProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomNumber <= cumulativeProbability) {
            letterIndex = i;
            break;
        }
    }
    const letter = letters[letterIndex];
    const number = Math.floor(Math.random() * 100) + 1;
    return `${letter}${number}`;
}

// 生成代号的路由
app.post('/generateCode', async (req, res) => {
    const name = req.body.name;
    if (!name || name.trim() === '') {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    try {
        let code;
        // 检查是否已经有生成的代号
        const existingCode = await Code.findOne({ name: name });
        if (existingCode) {
            code = existingCode.code;
        } else {
            code = generateRandomCode();
            await Code.create({ name: name, code: code });
        }
        res.json({ code: code });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
