const posts = require("../data/postsData.js");

const postsController = {
    index,
    show,
    store,
    update,
    modify,
    destroy
}

// le funzioni delle operazioni CRUD sono gestite dal controller per scremare il router e l'index.js
// tutto è centralizzato meglio e il codice risulta più pulito

function index(req, res) {
    const search = req.query.search;
    const tag = req.query.tags;
    // filtra contemporaneamente per tag e ricerca del titolo
    // restituisce tutti i post nel caso in cui non venga applicato nessun filtro
    const postsToShow = posts.filter((post) => {
        // filtro per tag
        if (tag) {
            const postTags = post.tags.map((postTag) => postTag.toLowerCase());
            // se il tag non è presente stoppa subito il filtro e il post non viene restituito
            if (!postTags.includes(tag)) return false;
        }
        // filtro per titolo
        if (search) {
            // se la ricerca non corriposnde con il titolo di nessun post allo questo non viene restituito
            if (!post.title.toLowerCase().includes(search)) return false;
        }
        // restituisce il post se ha passato entrambi i check di filtro
        return true;
    });

    res.json(postsToShow);
}

function show(req, res) {
    const post = posts.find((post) => post.id == req.params.id);
    if (isNaN(req.params.id) || !post) {
        res.status(404)
        
        return res.json(
            {
                error: "Not Found",
                message: `Id "${req.params.id}" is not valid, no such post exists`,
            }
        );
    } else {
        res.json(posts.find((post) => post.id == req.params.id));
    }
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
        tags: req.body.tags
    };
    
    // pusha il nuovo post nell'array di post
    posts.push(newPost);
    
    res.status(201);
    res.json(newPost);
}

function update(req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
    console.log(post);
    
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const tags = req.body.tags;

    if(!post) {
        res.status(404);
        return res.json({
            error: "Not Found",
            message: "No post with such id exists"
        })
    }

    posts[id-1] = {...posts[id-1], title, content, image, tags};


    res.send(posts[id-1]);
}

function modify(req, res) {
    res.send(`Aggiorno l'elemento con id: ${req.params.id}`);
}

function destroy(req, res) {
    const postToDelete = posts.find((post) => post.id == req.params.id);
    // se viene passato un id che non è un num o non esiste un post con
    // l'id specificato restituisce un errore
    if (isNaN(req.params.id) || !postToDelete) {
        res.status(404)
        
        return res.json(
            {
                status: 404,
                error: "Not found",
                message: `Error: post doesnt exist or bad id "${req.params.id}"`,
            }
        );
        // se il post esiste lo elimina dall'array dei post e restituire status ok
    } else {
        const indexOfPost = posts.indexOf(postToDelete);
        posts.splice(indexOfPost, 1);
        res.sendStatus(204);
    }
}

module.exports = postsController;
