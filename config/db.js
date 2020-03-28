// Requirements
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log(`MONGODB Connected: ${connect.connection.host} `.bgGreen.bold);
  } catch (err) {
    if (err) console.log(err);
  }
};

module.exports = connectDB;
