const express = require('express')
const { auth } = require('../middlewares/middlewares')
const user = require('../controllers/user')
const router = express.Router();
const catchasync = require('../utils/catchasyncerros')
const multer = require('multer');
const User = require('../models/user');
const { upload_rules } = require('../utils/uploadrules')
const upload = multer(upload_rules)



router.post('/signup', user.signup)

router.post('/login', user.login)

router.post('/logout', auth, user.logout)
router.post('/logoutAll', auth, user.logoutAll)

router.route('/me')
    .delete(auth, user.del)
    .patch(auth, user.edit)
    .get(auth, user.showMe)

router.route('/me/avatar')
    .post(auth, upload.single('avatar'), user.uploadAvatar)
    .delete(auth, upload.single('avatar'), user.delAvatar)

router.get('/:id/avatar', user.showAvatar)


module.exports = router


