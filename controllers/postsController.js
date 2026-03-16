const connection = require("../data/db.js");
const db = require("../data/db.js");

const postsController = {
    index,
    show,
    store,
    update,
    modify,
    destroy,
};

// le funzioni delle operazioni CRUD sono gestite dal controller per scremare il router e l'index.js
// tutto è centralizzato meglio e il codice risulta più pulito

function index(req, res) {
    const sqlQuery = "SELECT * FROM posts";

    db.query(sqlQuery, (err, results) => {
        if (err) return res.status(500).json({ error: "Query failed" });
        res.status(200).json(results);
    });
}

function show(req, res) {
    // id post da mostrare
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        return res.status(404).json({
            error: "Not Found",
            message: `Id "${id}" is not valid, no such post exists`,
        });
    }

    const sqlQuery = "SELECT * FROM posts WHERE id = ?";

    db.query(sqlQuery, [id], (err, results) => {
        if (err)
            return res
                .status(500)
                .json({ error: `Error fetching post with id: ${id}` });
        
        res.json(results[0]);
    });
}

function store(req, res) {
    // crea id in base all'id dell'ultimo elemento dell'array di post
    let newId = 0;
    posts.forEach((post, i) => {
        if (post.id > newId) {
            newId = post.id;
        }
    });

    // crea il nuovo post con i dati ricevuti dalla req
    const newPost = {
        id: newId + 1,
        title: req.body.name,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
    };

    // pusha il nuovo post nell'array di post
    posts.push(newPost);

    res.status(201);
    res.json(newPost);
}

function update(req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    console.log(post);

    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const tags = req.body.tags;

    if (!post) {
        res.status(404);
        return res.json({
            error: "Not Found",
            message: "No post with such id exists",
        });
    }

    posts[id - 1] = { ...posts[id - 1], title, content, image, tags };

    res.send(posts[id - 1]);
}

function modify(req, res) {
    res.send(`Aggiorno l'elemento con id: ${req.params.id}`);
}

function destroy(req, res) {
    // id del post da eliminare
    const id = req.params.id;

    // se viene passato un id che non è un num o non esiste un post con
    // l'id specificato restituisce un errore
    if (isNaN(req.params.id)) {
        res.status(404);
        return res.json({
            status: 404,
            error: "Not found",
            message: `Error: post doesnt exist or bad id "${req.params.id}"`,
        });
    }

    const sqlQuery = "DELETE FROM posts WHERE id = ?";

    // se il post esiste lo elimina
    db.query(sqlQuery, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Couldn't delete post" });
        res.sendStatus(204);
    });
}

module.exports = postsController;
