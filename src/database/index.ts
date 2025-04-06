import mongoose from "mongoose";
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = async () => {
  const connectionUrl =
    process.env.NEXT_PUBLIC_DATABASE_URl ||
    "mongodb://localhost:27017/your_database_name";

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err: any) => console.log("MongoDB connection failed", err));
};

export default connectToDB;
