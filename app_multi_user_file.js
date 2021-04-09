var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'Random Value1321312', // session id [server가 식별한는 client값]
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '98089808',
        database: 'm2'
    })
}));
app.get('/count', function(req, res) {
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count: '+ req.session.count);
});
app.get('/auth/logout', function(req, res) {
    delete req.session.displayName;
    req.session.save(function() {
        res.redirect('/welcome');
    });
});
app.get('/welcome', function(req, res) {
    if(req.session.displayName) { // session값 저장 => 넘겨주기
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">Logout</a> 
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `);
    }
});
app.post('/auth/login', function(req, res) { // 순서 중요함
    var uname = req.body.username;
    var pwd = req.body.password;
    for(var i=0; i<users.length; i++) {
        var user = users[i];
        if(uname === user.username && sha256(pwd+user.salt) === user.password) {
            req.session.displayName = user.displayName;
            return req.session.save( () => {
                res.redirect('/welcome');
            });
        }
    }
    res.send('Who are you? <a href="/auth/login">Login</a>');
});
app.post('/auth/register', function(req, res) { 
    var user = {
        username:req.body.username,
        password:req.body.password,
        displayName:req.body.displayName
    };
    users.push(user); 
    req.session.displayName = req.body.displayName;
    req.session.save( () => {
        res.redirect('/welcome');
    });
});
app.get('/auth/register', function(req, res) {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
        <input type="text" name="username" placeholder="username">
        </p>
        <p>
        <input type="password" name="password" placeholder="password">
        </p>
        <p>
        <input type="text" name="displayName" placeholder="displayName">
        </p>
        <p>
        <input type="submit">
        </p>
    </form>
    `;
      res.send(output);
  });
var users = [
    {
        username: 'minah',
        password: 'fa6cd383003d6709e1bed6dc7f16f860c230c0d09995c1406c5344bf1db2aad3', // 9808
        salt: '#@@#@!#!22',
        displayName: 'Minah'
    },
    {
        username: 'mark',
        password: '347b19920a5b04caaecd336350e32ee59ace0e7bf9c67ebc84f45f7ea7d9e313', // 1111
        salt: '#@@#@!#!sss',
        displayName: 'Mark'
    }
];
app.get('/auth/login', function(req, res) {
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
          <input type="text" name="username" placeholder="username">
      </p>
      <p>
          <input type="password" name="password" placeholder="password">
      </p>
      <p>
          <input type="submit">
      </p>
    </form>
    `;
      res.send(output);
  });

app.listen(3003, function(){
    console.log('Connected 3003 port');
})