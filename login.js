function login(appConfig, renderer, helper){
	var express = require('express');
	var router = express.Router();

	router.get('/', function(req, res, next) {
	  var section = '/LOGIN';
	  if(helper.isLogin(req)){
		section = '/ERROR/403';
		res.status(403);
	  }
	  var content = renderer.renderPage(section, req)
	  .then(function(content){
		res.send(content);
	  });
	});

	router.post('/', function(req, res, next) {
	  if(!helper.isLogin(req)){
		try{
		  var user = req.body["txtLoginUser"];
		  var password = req.body["txtLoginPass"];

		  var keysession = appConfig.App.Cookie.Key_Session;
		  var session = "testing";
		  var encsession = helper.encrypt(session);
		  let options = {
			httpOnly: true, // The cookie only accessible by the web server
			signed: false // Indicates if the cookie should be signed
		  }
		  // Set cookie
		  res.cookie(keysession, encsession, options) // options is optional
		  
		  var loginsession = '{"user":"' + user + '", "id":"'+ session + '"}';
		  helper.setRedis(session, loginsession);
		  res.send('00|Success');
		}
		catch(ex){
		  console.log(ex);
		  res.send('99|' + ex);
		}
	  }
	  res.send('403|Forbidden');
	});

	return router;
}

module.exports = login;
