# TODO
[] write tests
[] add to NPM

# hapi-pouchdb-plugin
Simple plugin to register multiple PouchDB instances under `server.plugins.pouch`

# Usage
### Install
```
npm i --save hapi-pouchdb-plugin
```

```js
server.register([
    {
        register: require('hapi-pouchdb-plugin'),
        options: {
            namespace: 'localUserDb',
            plugins: [require('pouchdb-find')],
            db: 'users'
        }
    },
    {
        register: require('hapi-pouchdb-plugin'),
        options: {
            namespace: 'remoteUserDb',
            db: 'users',
            hostname: 'example.com',
            port: 5984
        }
], (err) => {
    if (err) {
        // error registering plugins
    } else {
        server.start();
    }
});
```

The above code will initialize PouchDB with the `pouchdb-find` plugin. It will
also add a `pouches` property to the `server.plugins` object. Finally, it will
create two PouchDB instances, and register them on `server.plugins.pouches`.

Route handlers may then interact with any of the registered PouchDB
instances as follows:
```js
server.route({
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
        server.plugins.pouches.localUserDb.put({
            _id: new Date().toIsoString(),
            username: request.payload.username
        }).then((result) => {
            reply(result);
        }).catch((err) => {
            reply(boom.wrap(err));
        }
    }
});
```
