import mongoose from "mongoose";
const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // use  existing db connection
    console.log("using the exisiting  db connection!");
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log("DB CONNECTED!");
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
