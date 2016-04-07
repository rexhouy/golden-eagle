'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    Customer = mongoose.model('Customer'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Item
 */
exports.create = function(req, res) {
	var item = new Item(req.body);
	item.user = req.user;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
	// convert mongoose document to JSON
	var item = req.item ? req.item.toJSON() : {};

	// Add a custom field to the Article, for determining if the current User is the "owner".
	// NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
	item.isCurrentUserOwner = req.user && item.user && item.user._id.toString() === req.user._id.toString() ? true : false;

	res.jsonp(item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
	var item = req.item ;

	item = _.extend(item , req.body);

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
	var item = req.item ;

	item.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) { 
	Item.find().sort('-created').populate('user', 'displayName').lean().exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			items.forEach(function(item) {
				var size = 100 / (item.prices.length - 1);
				var maxCount = 0;
				item.prices.forEach(function(price, index) {
					price.position = "left:" + size * index + "%;";
					if (price.amount > maxCount) maxCount = price.count;
				});
				var progress = item.sales / maxCount * 100;
				progress = progress > 100 ? 100 : progress;
				item.progress = progress + "%";
			});
			res.json(items);
		}
	});
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Item is invalid'
		});
	}

	Item.findById(id).populate('user', 'displayName').exec(function (err, item) {
		if (err) {
			return next(err);
		} else if (!item) {
			return res.status(404).send({
				message: 'No Item with that identifier has been found'
			});
		}
		req.item = item;
		next();
	});
};


exports.upload = function(req, res) {
	res.json({path: req.files.file.path.replace('/home/rexhouy/tmp/uploads/', 'http://upload.localhost/')});
};

var saveRegisterInfo = function(req, res) {
	var customer = new Customer();
	customer.tel = req.session.tel;
	customer.item = req.item;
	req.item.sales += 1;
	req.item.save();
	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({succeed: true, customer: customer});
		}
	});
};

exports.register = function(req, res) {
	// if (req.code != req.session.code) {
	// 	res.json({succeed: false, message: "手机验证码错误"});
	// 	return;
	// }
	Customer.find({tel: req.session.tel}, function (err, customer) {
		if (customer.length > 0) {
			res.json({succeed: false, message: "每个用户只能参与一次。"});
		} else {
			saveRegisterInfo(req, res);
		}
	});

};

exports.captcha = function(req, res) {
	var captcha = require('simple-captcha').create({width: 100, height: 40});
	req.session.captcha = captcha.text();
	captcha.generate();
	res.write(captcha.buffer('image/png'));
	res.end();
};

// Send sms messages
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

var randomCode = function() {
	return Math.round(Math.random() * 1000000);
};

exports.sms = function(req, res) {
	if (!req.query.tel || req.query.captcha != req.session.captcha) {
		res.json({succeed: false, message: "验证码错误！"});
		return;
	}
	// var time = timeStamp();
	// var path = URL + "?sig="+sigParameter(time);
	req.session.code = randomCode();
	req.session.tel = req.query.tel;

	// sendRequest(path, {
	// 	"to": req.query.tel,
	// 	"appId": APP_ID,
	// 	"templateId": TEMPLATE_ID,
	// 	"datas": [req.session.code]
	// }, time);
	res.json({succeed: true});
};


exports.customer = function(req, res) {
	console.log(req.params.customerId);
	var id = req.params.customerId;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Customer is invalid'
		});
	}

	Customer.findById(id).exec(function (err, customer) {
		if (err || !customer) {
			res.status(404).send({
				message: 'No Customer with that identifier has been found'
			});
		} else {
			res.json(customer);
		}
	});
};