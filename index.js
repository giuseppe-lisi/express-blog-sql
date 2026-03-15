const express = require("express");
const app = express();
const port = 3000;
const postsRouter = require("./router/postsRouter.js");
const notFound = require("./middlewares/notFound.js");
const errHandler = require("./middlewares/errHandler.js");
const reqTime = require("./middlewares/reqTime.js");

app.get("/", (req, res) => {
    res.send("<h1>Benvenuto nel Server del Blog</h1>");
});

// amplio le funzionalità di express usando il router che gestisce le rotte
// e il body parser per poter leggere i post in arrivo
app.use(express.json());
app.use(reqTime);
app.use("/posts", postsRouter);

// not found handler
app.use(notFound);
// global error handler
app.use(errHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
