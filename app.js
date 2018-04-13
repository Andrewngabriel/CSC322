const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

app.set('view engine', 'pug');

const mainRoutes = require("./routes/index");
app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Up and running on: ${PORT}`);
});
