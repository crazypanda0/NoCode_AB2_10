const dotenv = require('dotenv');
dotenv.config();

//exporting port value from enviranment variable
module.exports = {
    PORT : process.env.PORT
}