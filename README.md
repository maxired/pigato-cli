# pigato-cli
A collection of Command Line Tools to manage or debug Pigato

#installation
``npm i -g pigato-cli``

#Usage

The first cli to be included is pigato-directory.
It allows to list workers proving a specifi topic, thanks to the Directory service, by launching a Directory instance and requesting it.

One can also launch only a Directory instance, or a client to request a Directory instance.

```javascript
Usage: pigato-directory [options]

 Options:

   -h, --help                 output usage information
   -V, --version              output the version number
   -d, --directory            launch only the directory server
   -c, --client               launch only the directory client
   -v, --verbose              verbose
   -e, --endpoint [endpoint]  set Endpoint [tcp://127.0.0.1:50000]
   -i, --intch [intch]        set Intch [tcp://127.0.0.1:55550]
   -t, --topic [topic]        topic [echo]
```
