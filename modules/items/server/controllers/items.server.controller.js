'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require(__config),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    Customer = mongoose.model('Customer'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

var TEST_MODE = true;

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
					price.position = 'left:' + size * index + '%;';
					if (price.count <= item.sales) price.position += 'color: #FF4081;font-size:16px;';
					if (price.amount > maxCount) maxCount = price.count;
				});
				var progress = item.sales / maxCount * 100;
				progress = progress > 100 ? 100 : progress;
				item.progress = progress + '%';
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
	res.json({path: req.files.file.path.replace(config.upload_path, config.upload_url)});
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
			res.json({succeed: true, customer: customer, message: '参与众筹成功。'});
		}
	});
};

var endDate = function() {
	var endTime = new Date();
	endTime.setFullYear(2016);
	endTime.setMonth(3);
	endTime.setDate(19);
	endTime.setHours(0);
	endTime.setMinutes(0);
	endTime.setSeconds(0);
	return endTime;
};

exports.register = function(req, res) {
	if (new Date() > endDate()) {
		res.json({succeed: false, message: '活动已经结束'});
		return;
	}
	if (!req.session.customerTel) {
		if (req.body.code == null) {
			res.json({succeed: false});
			return;
		}
		if (!TEST_MODE && req.body.code != req.session.code) {
			res.json({succeed: false, message: '手机验证码错误'});
			return;
		}
		req.session.customerTel = req.session.tel;
	}
	Customer.find({tel: req.session.customerTel, item: req.item}, function (err, customers) {
		if (customers.length > 0) {
			res.json({succeed: true, message: "您已经参与该商品的活动了。"});
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
var timeStamp = function() {
        var moment = require('moment');
        return moment().format('YYYYMMDDHHmmss');
};

var sigParameter = function(timestamp) {
        var crypto = require('crypto');
        return crypto.createHash('md5').update(config.sms_account_id + config.sms_auth_token + timestamp).digest("hex");
};

var authorization = function(timestamp) {
        return new Buffer(config.sms_account_id + ':' + timestamp).toString('base64');
};

var sendRequest = function(path, data, timestamp) {
        var https = require('https');
        var querystring = require('querystring');
        data = JSON.stringify(data);

        var req = https.request({
                host: config.sms_host,
                port: config.sms_port,
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
	if (!req.query.tel) { //  || req.query.captcha != req.session.captcha
		res.json({succeed: false, message: "手机号错误！"});
		return;
	}
	var time = timeStamp();
	var path = config.sms_url + "?sig="+sigParameter(time);
	req.session.code = randomCode();
	req.session.tel = req.query.tel;

	if (!TEST_MODE) {
		sendRequest(path, {
			"to": req.query.tel,
			"appId": config.sms_app_id,
			"templateId": config.sms_template_id,
			"datas": [req.session.code]
		}, time);
	}

	res.json({succeed: true});
};


exports.customer = function(req, res) {
	if (req.session.customerTel) {
		// Find items ids by tel
		Customer.find({tel: req.session.customerTel}, function(err, customers) {
			var ids = customers.map(function(customer) {
				return customer.item;
			});
			// Find items by ids
			Item.where('_id').in(ids).exec(function(err, items) {
				res.json({items: items});
			});
		});
	} else {
		res.json(null);
	}
};

exports.statistics = function(req, res) {
	Customer.count(function(err, count) {
		if (err) {
			res.json({succeed: false, err: err});
		} else {
			res.json({succeed: true, count: count});
		}
	});
};

exports.itemStatistics = function(req, res) {
	Customer.find({item: req.params.itemId}, function(err, customers) {
		if (err) {
			res.json({succeed: false, err: err});
		} else {
			res.json({succeed: true, customers: customers});
		}
	});
};
