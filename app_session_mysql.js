var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
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
    var user = {
        username: 'minah',
        password: '1111',
        displayName: 'Minah'
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if(uname === user.username && pwd === user.password) {
        req.session.displayName = user.displayName;
        req.session.save( () => {
            res.redirect('/welcome');
        });
    } else {
        res.send('Who are you? <a href="/auth/login">Login</a>');
    }
});
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