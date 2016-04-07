'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
        name: {
                type: String,
                default: '',
                required: '请输入名字',
                trim: true
        },
        prices: [
                {count: Number, amount: Number}
        ],
        sales: {
                type: Number,
                default: 0
        },
        storage: {
                type: Number,
                required: '请输入库存'
        },
        img: {
                type: String,
                required: '请上传图片'
        },
        startTime: {
                type: Date,
                required: '请选择开始时间'
        },
        endTime: {
                type: Date,
                required: '请选择结束时间'
        },
        created: {
                type: Date,
                default: Date.now
        },
        user: {
                type: Schema.ObjectId,
                ref: 'User'
        }
});

mongoose.model('Item', ItemSchema);
