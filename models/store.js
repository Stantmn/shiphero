const mongoose = require('mongoose');

// Store Schema
const StoreSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: String
    },
    differentFulfillment: {
        type: Boolean
    },
    fulfillmentService: {
        type: Boolean
    },
    fulfillmentServiceId: {
        type: Number
    },
    sendField: {
        type: String
    },
    company: {
        type: String
    },
    storeName: {
        type: String
    },
    recurringPaymentId: {
        type: Number
    },
    merchantIdentifier: {
        type: String,
        index: {unique: true}
    },
    apiKeyBorderGuru: {
        type: String
    },
    apiKeyMerchant: {
        type: String
    },
    apiKeyShopify: {
        type: String
    },
    apiSecretShopify: {
        type: String
    },
    apiKeyAdmin: {
        type: String
    },
    accessToken: {
        type: String
    },
    apiSecretAdmin: {
        type: String
    },
    accountNumber: {
        type: String
    },
    countryOfOrigin: {
        type: String
    },
    countryCode: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    postcode: {
        type: String
    },
    houseNo: {
        type: String
    },
    streetName: {
        type: String
    },
    location: {
        type: Number
    },
    locationAddress: {
        type: String
    },
    totalWeightScale: {
        type: String
    },
    weight: {
        type: Number
    },
    dimensionalScale: {
        type: String
    },
    length: {
        type: Number
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Store = module.exports = mongoose.model('Store', StoreSchema);

module.exports.createStore = function (newStore, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newStore.password, salt, function (err, hash) {
            newStore.password = hash;
            newStore.save(callback);
        });
    });
};

module.exports.updateStore = async (_id, storeData) => {
    if (storeData.password) {
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        const hash = await bcrypt.hash(storeData.password, salt);
        console.log(hash);
        storeData.password = hash;
        storeData._id = _id;
        return storeData.updateOne(storeData);
    } else {
        storeData._id = _id;
        storeData.password = undefined;
        return storeData.updateOne(storeData);
    }
};

module.exports.getStorePassportById = function (id, callback) {
    Store.findById(id, callback);
};

module.exports.getStoreById = function (id) {
    return Store.findById(id);
};

module.exports.getStoreByEmail = function (email, callback) {
    const query = {email: email};
    Store.findOne(query, callback);
};

module.exports.getStoreByDomain = (merchantIdentifier) => {
    const query = {merchantIdentifier: merchantIdentifier};
    return Store.findOne(query);
};

module.exports.getStoresList = () => {
    return Store.find();
};

module.exports.deleteStoreById = function (id, callback) {
    Store.findOne({_id: id}, callback).remove().exec();
};
