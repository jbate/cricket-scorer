exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * Login. (Uses proper authentication later)
 */
exports.admin = function(req, res){
  if(req.param('name') != ""){
    res.render('admin', {loggedIn: req.param('name')});
  } else {
    res.render('admin');
  }
};
exports.login = function(req, res){
  if(req.param('name') == "James"){
    res.redirect('/admin/' + req.param('name'));
  } 
  else {
    res.redirect('/admin');
  }
};