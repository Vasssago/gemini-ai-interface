const express = require("express");
const path = require("path");
const app = express();
const port = 3030;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.send('CHECKED');
});

app.get('/tests', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'tests', 'testpage.html'));
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});