const UserService = require('../services/user-services.js');

const userService = new UserService();

const signup = async (req, res)=>{
    try {
        const response = await userService.signup({
            email: req.body.email,
            password : req.body.password,
            name : req.body.name
        });
        return res.status(201).json({
            data : response,
            message: 'Successfully created user',
            error: {},
            success: true
        });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            data : {},
            message : 'something went wrong',
            success : false,
            error : error
        });
    }
    
}

const login = async (req,res) =>{
    try {
        const token = await userService.signin(req.body);
            return res.status(200).json({
                success:true,
                message:"Successfully logged in",
                data: token,
                err: {}
            })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong",
            success: false,
            data: {},
            err: error
        });
    }
}

module.exports = {
    signup,
    login
}