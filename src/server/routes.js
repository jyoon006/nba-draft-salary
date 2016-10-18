module.exports = function(app, passport, session, Users) {
  // app.post('/', function(req, res) {
  //   console.log("landing page");
  // })

  // app.get('/api/signin', function(req, res) {
  //   console.log('req session', req.session);
  //   if( req.session.cookie._expires === new Date()) {
  //     res.send('expired');
  //   }
  //   else {
  //     res.send('active');
  //   }
  // });

  app.get('/auth/google/logout', function(req, res) {
    req.logOut();
    req.session.destroy(function (err) {
      res.redirect('/'); 
    });
  })

  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  app.get('/auth/google/callback', passport.authenticate('google', 
    { 
      successRedirect : '/#/playerlist', 
      failureRedirect : '/',
      failureFlash : true
    }
  ));

  app.post('/profile', function(req, res) {
    var user_id = req.body.data;
    
    Users.find({ id: user_id }, function(err, user) {
      if(err) return console.error(err);
      if(user.length === 0) return console.error('Cannot find user');
      else res.json(user);
    
    });
  });

  app.post('/users/myteam', function(req, res) {
    var user_id = req.body.data.user_id;
    var player = req.body.data.player;

    Users.findOne({ id: user_id }, function(err, user) {
      if(err) return console.error(err);
      if(user.length === 0) return console.error('Cannot find user');
      
      else {
        console.log('user', user);
        user.players.push(player);
        user.save(function (err) {
          if(err) return console.error(err);
          else return res.json(user);
        });
      }
      
    });
  });

  app.post('/users/myteam/update', function(req, res) {
    var user_id = req.body.data.user_id;
    var player_name = req.body.data.player.Player;
    Users.findOne({ id: user_id }, function(err, user) {

      user.players.forEach(function(player, index, list) {
        if( player.Player === player_name ) {
          list.splice(index, 1);
        }
      });

      user.save(function (err) {
        if(err) return console.error(err);
        else return res.json(user);
      });

    });
  });

  app.get('/users/teams/all', function(req, res) {
    Users.find({}, function(err, users) {
      if(err) return console.error(err);
      else res.json(users);
    });
  });
}







