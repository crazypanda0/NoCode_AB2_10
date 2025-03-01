const UserRepository = require('../repository/user-repository.js');
const User = require('../models/user.js');

const userRepository = new UserRepository();

class UserService{
    async signup(data){
        console.log('from user service 1', data);
        try {
            const user = await userRepository.create(data);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserByEmail(email){
        try {
            const user = await User.findBy(email);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async signin(data) {
        try {
            const user = await User.findOne({email : data.email});
            console.log(data.email, data.password);
            console.log("from service 1",user);
            if(!user){
                throw {
                    message: "No user found",
                };
            }
            let x = user.comparePassword(data.password);
            console.log("From service 2",x)
            if(!user.comparePassword(data.password)){
                throw {
                    message: "Incorrect password",
                };
            }
            const token = user.genJWT();
                return token;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UserService;