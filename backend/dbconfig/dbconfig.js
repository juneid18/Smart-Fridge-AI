const mongoose = require('mongoose');

async function connect(){
    try {
        mongoose.connect(process.env.MONGOOSE_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connection is Succesfull');
        });
        connection.on('error', (err) => {
            console.log('Connection Error: ' , err);
        });
    } catch (error) {
        console.log('Something went wrong in Database' + error);
    }
}
module.exports = connect;
