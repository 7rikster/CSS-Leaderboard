import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionUrl =
    process.env.DATABASE_URl ||
    "mongodb://localhost:27017/your_database_name";

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection failed", err));
};

export default connectToDB;
