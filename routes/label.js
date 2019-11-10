const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../shared/config');
const Order = require('../models/order');
const Store = require('../models/store');

router.get('/', function (req, res) {
    res.status(200).json('OK');
});

router.get('/:_file', async (req, res) => {
    if (req.params._file) {
        const orderId = req.params._file.split('.', 1);
        // const orderId = '15283160757151041';
        try {
            request(config.bgLabelURL + orderId + '?apikey=' + config.appKey).pipe(res);
        } catch (e) {
            res.status(500).json({code: 400, error: 'Can\'t get label'});
            console.log(e);
        }
    } else {
        res.status(500).json({code: 400, error: 'Filename is incorrect'});
    }
});

router.post('/', async (req, res) => {
    const order = req.body;
    console.log(order);
    if (order && order.order_id) {
        console.log(order.order_id);
        try {
            let myOrder = await Order.getOrderByShopifyOrderId(order.order_id);

            if (myOrder) {
                const label = {
                    code: 200,
                    shipping_method: 'Standard',
                    tracking_number: myOrder.shipmentIdentifier,
                    cost: 0.00,
                    label: config.labelURL + myOrder.shipmentIdentifier + '.pdf',
                    customs_info: '',
                    shipping_carrier: 'Hermes_BorderGuru'
                };
                console.log('Label response');
                console.log(label);
                res.status(200).json(label);
            } else {
                res.status(500).json({code: 404, error: 'Can\'t get an order'});
                console.log('Order not found in DB: ' + order.order_id);
            }

        } catch (e) {
            res.status(500).json({code: 404, error: 'Can\'t get an order'});
            console.log(e);
        }
    } else {
        res.status(500).json({code: 404, error: 'Order id does not exist'});
    }
});
module.exports = router;
