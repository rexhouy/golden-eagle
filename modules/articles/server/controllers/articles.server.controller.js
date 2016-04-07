'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    express = require('express');

/**
 * Create a article
 */
exports.create = function (req, res) {
        var article = new Article(req.body);
        article.user = req.user;

        article.save(function (err) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(article);
                }
        });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
        res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
        var article = req.article;

        article.title = req.body.title;
        article.content = req.body.content;

        article.save(function (err) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(article);
                }
        });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
        var article = req.article;

        article.remove(function (err) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(article);
                }
        });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
        Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
                if (err) {
                        return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                        });
                } else {
                        res.json(articles);
                }
        });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //         return res.status(400).send({
        //                 message: 'Article is invalid'
        //         });
        // }

        // Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
        //         if (err) {
        //                 return next(err);
        //         } else if (!article) {
        //                 return res.status(404).send({
        //                         message: 'No article with that identifier has been found'
        //                 });
        //         }
        //         req.article = article;
                next();
        // });
};

exports.captcha = function(req, res) {
        var captcha = require('simple-captcha').create({width: 100, height: 40});
        console.log(captcha.text());
        captcha.generate();
        res.write(captcha.buffer('image/png'));
        res.end();
};

var HOST = 'app.cloopen.com',
    PORT = '8883',
    ACCOUNT_ID = '8a48b5514e3e5862014e4d8dbcfd0e32',
    URL = '/2013-12-26/Accounts/'+ACCOUNT_ID+'/SMS/TemplateSMS',
    AUTH_TOKEN = 'aab4e3de8705464a867248fdd23fa42e',
    APP_ID = 'aaf98f894e3e5b81014e4d8ffb3a0f41',
    TEMPLATE_ID = '39993';
var timeStamp = function() {
        var moment = require('moment');
        return moment().format('YYYYMMDDHHmmss');
};

var sigParameter = function(timestamp) {
        var crypto = require('crypto');
        return crypto.createHash('md5').update(ACCOUNT_ID + AUTH_TOKEN + timestamp).digest("hex");
};

var authorization = function(timestamp) {
        return new Buffer(ACCOUNT_ID + ':' + timestamp).toString('base64');
};

var sendRequest = function(path, data, timestamp) {
        var https = require('https');
        var querystring = require('querystring');
        data = JSON.stringify(data);

        var req = https.request({
                host: HOST,
                port: PORT,
                path: path,
                method: 'POST',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': "application/json;charset=utf-8",
                        'Authorization': authorization(timestamp),
                        'Content-Length': data.length
                }
        }, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                        console.log('Response: ' + chunk);
                });
        });
        req.write(data);
        req.end();
};

exports.sms = function(req, res) {
        var time = timeStamp();
        var path = URL + "?sig="+sigParameter(time);

        sendRequest(path, {
                "to": "13914798831",
                "appId": APP_ID,
                "templateId": TEMPLATE_ID,
                "datas": ["123456"]
        }, time);
};
