const multer = require('multer');
module.exports.upload = multer({
    // dest:'avatar',
    limits: {
        fileSize: 1000000//restricting file size
    },
    //am using mimetype because its reliable in security wise 

    fileFilter(req, file, cb) {
        if (!file.mimetype.match(/^image\/(png|jpeg|jpg)$/)) {
            return cb(new Error('Only JPEG/PNG files are allowed'));
        }
        cb(null, true);
    }

})


