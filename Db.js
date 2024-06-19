import mongoose from 'mongoose';

// MongoDB connection URL
const mongoURL = 'mongodb+srv://mtsakaoglu:KAeDnvShvUf9DpY0@aucmongodb.krps0oo.mongodb.net/?retryWrites=true&w=majority&appName=AucMongoDb';

// Connect to MongoDB
mongoose.connect(mongoURL, {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

    
const db = mongoose.connection;

export default db;
// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    password: {
        type: String,
        required: true
    }
});

// User Model
const User = mongoose.model('User', userSchema);

export { User };