'use strict';

/**
 * Module dependencies
 */
var itemsPolicy = require('../policies/items.server.policy'),
    items = require('../controllers/items.server.controller');

module.exports = function(app) {
        // Items Routes
        app.route('/api/items').all(itemsPolicy.isAllowed)
                .get(items.list)
                .post(items.create);

        app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
                .get(items.read)
                .put(items.update)
                .delete(items.delete);

        app.route('/api/item/upload').all(itemsPolicy.isAllowed)
                .post(items.upload);

        app.route('/api/item/captcha').all(itemsPolicy.isAllowed)
                .get(items.captcha);

        app.route('/api/item/send_code').all(itemsPolicy.isAllowed)
                .get(items.sms);

        app.route('/api/item/:itemId/register').all(itemsPolicy.isAllowed)
                .post(items.register);

        app.route('/api/customer').all(itemsPolicy.isAllowed)
                .get(items.customer);

        // Finish by binding the Item middleware
        app.param('itemId', items.itemByID);
};
