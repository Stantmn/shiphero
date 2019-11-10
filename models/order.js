const mongoose = require('mongoose');

// Order Schema
const OrderSchema = mongoose.Schema({
    submerchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    shopifyOrderId: {
        type: Number,
        index: {unique: true}
    },
    orderIdentifier: {
        type: String
        // type: String, index: { unique: true }
    },
    shippingRate: {
        type: Number
    },
    orderName: {
        type: String, index: true
    },
    shipmentIdentifier: {
        type: String
    },
    linkTracking: {
        type: String
    },
    fulfillmentId: {
        type: Number
    },
    shippingStatus: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.createOrder = (newOrder) => {
    const product = new Order(newOrder);
    return product.save();
};

module.exports.updateOrder = (orderData) => {
    return orderData.updateOne(orderData);
};

module.exports.updateStatus = (_id, status) => {
    return Order.findByIdAndUpdate(_id, {$set: {shippingStatus: status}}, {new: true});
};

module.exports.getOrderById = (id) => {
    return Order.findById(id).populate('submerchant');
};

module.exports.getOrderByShopifyOrderId = (shopifyOrderId) => {
    const query = {shopifyOrderId: shopifyOrderId};
    return Order.findOne(query).populate('submerchant');
};

module.exports.getOrderByOrderIdentifier = (orderIdentifier) => {
    const query = {orderIdentifier: orderIdentifier};
    return Order.findOne(query).populate('submerchant');
};

module.exports.getOrdersList = (submerchant) => {
    const query = {submerchant: submerchant};
    return Order.find(query).populate('submerchant');
};

module.exports.getOrdersListByOrderNames = (queryOrders) => {
    const query = {
        submerchant: queryOrders.submerchant,
        orderName: { $in : queryOrders.orderNames}
    };
    return Order.find(query);
};

module.exports.getUndeliveredOrdersList = () => {
    return Order.find().where('shippingStatus').in([
        'confirmed',
        'in_transit',
        'out_for_delivery'
    ]).populate('submerchant');
};

module.exports.deleteOrderById = (id) => {
    return Order.findOne({_id: id}).remove().exec();
};
