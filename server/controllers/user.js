const UserData = require("../models/user");
const bcrypt = require("bcrypt");

class userController {

    static async deleteUser(req, res) {
        const id = req.params.id;
        const deleted = await UserData.findByIdAndRemove(id).exec();

        if (!deleted) {
            return res.status(400).json("Wrong data");
        }
        res.json({ message: 'deleted' });
        return
    }

    static async updateUser(req, res) {
        // if(req.body.userId === req.params.id){
        const id = req.params.id;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await UserData.findByIdAndUpdate(id,
            {
                $set: req.body
            }, { new: true }
        );

        if (!updatedUser) {
            res.status(400).json("Wrong data");
        }

        return res.status(200).json(updatedUser);
    }
    static async getUser(req, res) {
        const user = await UserData.findById(req.params.id);
        const { password, ...others } = user._doc;
        return res.status(200).json(others);
    }
}
module.exports = userController;