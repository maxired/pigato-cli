#!/usr/bin/env node

var Pigato = require('pigato');
var program = require('commander');
var debug = require('debug')('pigato:cli');

program
  .version('0.0.1')
  .option('-d, --directory', 'launch only the directory server')
  .option('-c, --client', 'launch only the directory client')
  .option('-v, --verbose', 'verbose')
  .option('-e, --endpoint [endpoint]', 'set Endpoint [tcp://127.0.0.1:50000]',
    'tcp://127.0.0.1:50000')
  .option('-i, --intch [intch]', 'set Intch [tcp://127.0.0.1:55550]',
    'tcp://127.0.0.1:55550')
  .option('-t, --topic [topic]', 'topic [echo]',
    'echo')
  .parse(process.argv);

if (program.verbose) {
  debug = console.log.bind(console);
}

var conf = {
  heartbeat: 30,
  intch: program.intch
};


var tmpDirectory = program.directory || !(program.directory || program.client);
program.client = program.client || !(program.directory || program.client);
program.directory = tmpDirectory;

startDirectoryIfNeeded(program, function() {
  startClientIfNeeded(program)
});



function startDirectoryIfNeeded(program, cb) {
  if (!program.directory) {
    return cb();
  }

  debug('will start Directory service with endpoint %s and conf %s', program.endpoint,
    JSON.stringify(conf));
  var directory
  var nbReboot = 0;

  /* <neededBeacauseOf pigato issues #53> */
  conf.onStart = function() {
    if (nbReboot == 0) {
      directory.stop();
    };

  };
  conf.onStop = function() {
      if (nbReboot == 0) {
        nbReboot++;
        directory.start();
      }
    }
    /* </neededBeacauseOf pigato issues #53> */

  directory = new Pigato.services.Directory(program.endpoint, conf);
  directory.start();
  directory.sub.once('message', function() {
    setImmediate(cb);
  });
}

function startClientIfNeeded(program) {
  if (program.client) {
    debug('will start client with endpoint %s', program.endpoint);
    var client = new Pigato.Client(program.endpoint, conf);
    client.start();

    client.request(
      '$dir', program.topic, undefined,
      function(err, workers) {
        console.log(err, workers);
        process.exit(0);
      }
    );
  }
}
