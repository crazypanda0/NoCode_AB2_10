const User = require('../models/user.js');

class UserRepository{
    async create(data){
        try {
            const response = await User.create(data);
            return response;
        } catch (error) {
            console.log("something went wrong at user repo", error);
            throw error;
        }
    }
    async get(id){
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            console.log("something went wrong at user repo", error);
            throw error;
        }
    }
    async destroy(id){
        try {
            const response = await User.findOneAndDelete(id);
            return response;
        } catch (error) {
            console.log("something went wrong at user repo", error);
            throw error;
        }
    }
}

module.exports = UserRepository;