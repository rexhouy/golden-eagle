'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
        tel: {
                type: String,
                trim: true
        },
        created: {
                type: Date,
                default: Date.now
        },
        item: {
                type: Schema.ObjectId,
                ref: 'Item'
        }
});

mongoose.model('Customer', CustomerSchema);
