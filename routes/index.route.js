const express = require('express');
const accountRoute = require('./account.route');
const typeRoute = require('./type.route');
const deviceRoute = require('./device.route');
const sessionRoute = require("./session.route");
const areaRoute = require("./area.route")
const datalogRoute = require("./dataLog.route")
const permissionRoute = require("./permission.route")
module.exports = (app) => {
    const version = '/api/v1';
    app.use(version + '/account', accountRoute);
    app.use(version + "/type", typeRoute);
    app.use(version + "/area", areaRoute);
    app.use(version + '/device', deviceRoute);
    app.use(version + "/session", sessionRoute);
    app.use(version + "/datalog", datalogRoute);    
    app.use(version + "/permission", permissionRoute);
};