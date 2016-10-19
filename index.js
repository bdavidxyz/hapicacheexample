'use strict';

const Hapi = require('hapi');
const Wreck = require('wreck');

const server = new Hapi.Server();
const SECOND = 1000;

server.connection({ port: 3000 });


const getNasaData = function(count, next) {
  // const count = opts.count || 10;
  Wreck.get('https://jsonplaceholder.typicode.com/posts/'+ count, (err, res, payload) => {
      console.log("Getting data..."); // log so we can tell when a request is made
       if (err) {
        next(err);
      } else {
        next(null, JSON.parse(payload));
      }
    });
};

server.method('getNasaData', getNasaData,  {
  cache: {
        expiresIn: 10 * SECOND,
        generateTimeout: 100
    }
});


server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    var count = request.query.count || 10;
    console.log(JSON.stringify(request.query));
    server.methods.getNasaData(count, function(error, result) {
      reply(error || result);
    });
  }
});


server.start((err) => {

  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
