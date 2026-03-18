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

    const sqlQueryPost = "SELECT * FROM posts WHERE id = ?";
    const sqlQueryTags = `
        SELECT * 
        FROM post_tag
        JOIN tags
        ON post_tag.tag_id = tags.id
        WHERE post_tag.post_id = ?`;

    db.query(sqlQueryPost, [id], (err, postResults) => {
        if (err) {
            return res
                .status(500)
                .json({ error: `Error fetching post with id: ${id}` });
        }
        if (postResults.length === 0) {
            return res.status(404).json({
                error: "Not found",
                message: "Il post da mostrare non è stato trovato",
            });
        }
        const post = postResults[0];
        console.log(post);

        db.query(sqlQueryTags, [post.id], (err, results) => {
            if (err)
                return res.status(500).json({
                    error: "Query failed",
                    message: "Couldn't find tags",
                });
            post.tags = results.map((tag) => tag.label);
            res.json(post);
        });
    });
}

function store(req, res) {
    // ci aspettiamo che l'utente ci invii questi dati nella sua req
    if (req.body.id) {
        return res.status(403).json({
            error: "Bad request",
            message: "You can't manually add IDs",
        });
    }
    // controlla che venga inserito un titolo per il post
    if (!req.body.title) {
        return res.status(403).json({
            error: "Bad request",
            message: "The post has to have a title",
        });
    }

    // destrutturo i dati dell'oggetto ricevuti nel request body
    const { title, content, image } = req.body;

    // prepared statement
    const sqlQuery = `
        INSERT 
        INTO posts (title, content, image) 
        VALUES (?, ?, ?)`;

    const sqlQueryAddedPost = `
        SELECT *
        FROM posts
        WHERE posts.title = ?`;

    // query per aggiungere il post al db 
    db.query(sqlQuery, [title, content, image], (err, results) => {
        if (err) return res.status(500).json({error: "Query failed", message: "Unable to add new post"});

        // restituisce il post appena creato se viene creato 
        db.query(sqlQueryAddedPost, [title], (err, results) => {
            res.status(201).json({
                message: "Post created successfully",
                post: results
            });
        }); 
    });
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
