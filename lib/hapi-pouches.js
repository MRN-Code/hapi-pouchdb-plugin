'use strict';

const PouchDb = require('pouchdb');
const url = require('url');
const _ = require('lodash');
const defaultOptions = {
    namespace: 'default',
    port: null,
    hostname: null,
    protocol: null,
    db: 'my-db',
    plugins: []
};
let dbUrl;

module.exports = function(server, options, next) {
    options = _.merge(defaultOptions, options);

    // register PouchDB plugins
    // this seems to be safe to do every time this function is called
    // even if the same plugin gets registered multiple times YMMV
    _.forEach(options.plugins, (plugin) => {
        PouchDb.plugin(plugin);
    });

    if (options.hostname) {
        dbUrl = url.format({
            protocol: options.protocol,
            hostname: options.hostname,
            port: options.port,
            pathname: options.db
        });
    } else {
        dbUrl = options.db;
    }

    const db = new PouchDb(dbUrl);

    // throw error if namespace already exists
    if (server.plugins.hapi-pouches[options.namespace]) {
        const msg = 'PouchDB namespace `' + options.prefix + '` already exists';
        next(new Error(msg));
    }

    // attempt to get info from the db
    return db.info()
        .then(() => {
            server.expose(namespace, db);
            next();
        }).catch(next);
};

module.exports.attributes = {
    pkg: require('./package.json'),
    multiple: true
};
