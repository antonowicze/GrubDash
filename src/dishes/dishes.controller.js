const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function bodyHasNameProperties(req, res, next) {
    const {data: {name} = {}} = req.body;

    if(name) { 
        return next();
    }
    next({
        status: 400,
        message: `A 'name' property is required.`
    });
};

function bodyHasDescriptionProperties(req, res, next) {
    const {data: {description} = {}} = req.body;

    if(description) {
        return next()
    }
    next({
        status: 400,
        message: `A 'description' property is required.`
    });
};

function bodyHasPriceProperty(req, res, next) {
    const {data: {price} = {}} = req.body;

    if(price) {
        return next()
    }
    next({
        status: 400,
        message: `A 'price' property is required.`
    });
};

function bodyHasUrlProperties(req, res, next) {
    const {data: {image_url} = {}} = req.body;

    if(image_url) {
        return next()
    }
    next({
        status: 400,
        message: `A 'image_url' property is required.`  
    });
};

function pricePropertiesIsValid(req, res, next) {
    const {data: {price} = {}} = req.body;

    if(price > 0) {
        return next()
    }
    next({
        status: 400,
        message: `price cannot be less than 0.`
    });
};

function pricePropertyIdInteger(req, res, next) {
    const {data: {price} = {}} = req.body;

    if(typeof price !== "number" || price <= 0) {
        next({
            status: 400,
            message: "price must be number." 
        });
    }
    return next()
};


//middleware function to check if a dish exists
function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next()
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    });
}


function dataIdMatchesDishId(req, res, next) {
    const {data: {id} = {}} = req.body;
    const dishId = req.params.dishId;
    if(id !== undefined && id !== null && id !== "" && id !== dishId) {
        next ({
            status: 400,
            message: `id ${id} must match dataId`
        });
    }
    return next()
}



function list(req, res) {
    res.json({data: dishes })
};

function read(req, res) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId)
    res.json({data: foundDish})
};

function create(req, res) {
    const {data: {name, price, description, image_url} = {}} = req.body;
    const newDish = {
        id: nextId(),
        name,
        price,
        description,
        image_url
    }
    dishes.push(newDish);
    res.status(201).json({data: newDish})
};


function update(req, res) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId)
    const {data: {name, price, description, image_url} = {}} = req.body;
    foundDish.name = name;
    foundDish.price = price;
    foundDish.description = description;
    foundDish.image_url = image_url;
    res.json({data: foundDish})
}
 


module.exports = {
    list,
    read:   [dishExists, read],
    create: [bodyHasNameProperties, 
            bodyHasDescriptionProperties, 
            bodyHasPriceProperty, 
            bodyHasUrlProperties, 
            pricePropertiesIsValid, 
            pricePropertyIdInteger, 
            create],
    update: [dishExists, 
            dataIdMatchesDishId, 
            bodyHasNameProperties, 
            bodyHasDescriptionProperties, 
            bodyHasPriceProperty, 
            bodyHasUrlProperties, 
            pricePropertiesIsValid, 
            pricePropertyIdInteger, 
            update]
}