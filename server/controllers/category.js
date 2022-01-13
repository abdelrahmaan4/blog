const catData = require('../models/category');

class catController{
    static async createCat(req, res){
        const cat = new catData(req.body);
        const newCat = await cat.save();
        return res.status(201).json(newCat);
    }
    static async getCats(req, res){
        const cats = await catData.find();
        return res.status(201).json(cats);
    }
}

module.exports = catController;