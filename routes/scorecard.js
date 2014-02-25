exports.new = function(req, res){
  res.render('scorecard/new', { title: 'Create new scorecard' });
};

exports.load = function(req, res){
  // Load from "/scorecard/new" view
  if(typeof req.param('homeTeam') != 'undefined' && typeof req.param('awayTeam') != 'undefined'){
	res.redirect('/scorecard/' + req.param('homeTeam') + '/' + req.param('awayTeam'));
  } 
  // Load from RESTful URL
  else {
  	var collection = [{name:"james", score: 65}, {name: "jess", score: 20}, {name: "frankie", score: 0}];
    
  	res.render('scorecard/view', { homeTeam: req.param('home'), awayTeam: req.param('away'), list: collection });
  }
};