'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const JWT         = require('jsonwebtoken');


// Se configura ambiente
const env = process.env.NODE_ENV || 'development';

//Carga de configuracion
global.config = require('./config/config')[env];



// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 3000
});

//Connect to db
server.app.db = mongojs('appicare', ['appicare']);



//Token validate
// bring your own validation function
var validate = function (decoded, request, callback) {

    server.app.db.users.findOne({
        _id: decoded._id
    }, (err, doc) => {
        if (err) {
          return callback(null, false);
        }
        return callback(null, true);
    });

};



server.start(function () {
  console.log('Server running at:', server.info.uri);
});

//SASS Options
// var options = {
//     src: './styles/sass',
//     dest: './styles',
//     force: true,
//     debug: true,
//     routePath: '/styles/{file}.css',
//     includePaths: ['./node_modules/bootstrap/scss'],
//     outputStyle: 'compressed',
//     sourceComments: true,
//     srcExtension: 'scss'
// };


//Load plugins and start server
server.register([
    require('hapi-auth-jwt2'),
], (err) => {

    if (err) {
      console.log(err);
      throw err;
    }


    const db = server.app.db;


    server.auth.strategy('jwt', 'jwt',
    { key: '...',          // Never Share your secret key
      validateFunc: validate,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });

    // server.auth.default('jwt');




    server.route([].concat(
        require('./routes/hospitals').endpoints(db),
        require('./routes/sessions').endpoints(db),
        require('./routes/users').endpoints(db)
    ));


    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
