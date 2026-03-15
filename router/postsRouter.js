const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController.js");

// il router gestisce le rotte, il controller passa le funzioni da chiamare
// per ogni operazione CRUD possibile
router.get("/", postsController.index);

router.get("/:id", postsController.show);

router.post("/", postsController.store);

router.put("/:id", postsController.update);

router.patch("/:id", postsController.modify);

router.delete("/:id", postsController.destroy);

module.exports = router;