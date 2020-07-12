module.exports.setFlash = function(req, res, next){         //middleware for flash messages
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}