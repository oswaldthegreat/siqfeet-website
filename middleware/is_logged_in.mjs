function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next(); // deserializeUser already ran
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'You must be logged in to add to cart or buy items');
  return res.redirect('/login'); // or send 401 if API
}

export { isLoggedIn };