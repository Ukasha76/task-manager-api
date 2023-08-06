const express = require('express')
const task = require('../controllers/tasks')
const { auth } = require('../middlewares/middlewares')
const router = express.Router();

router.route('/')
    .get(auth, task.showall)
    .post(auth, task.insert)

router.route('/:id')
    .get(auth, task.show)
    .patch(auth, task.edit)
    .delete(auth, task.del)


module.exports = router
