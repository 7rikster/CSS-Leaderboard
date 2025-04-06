import mongoose from "mongoose";

const OpenSourceSchema = new mongoose.Schema({
  name: String,
  score: Number,
  issuesFixed: [
    {
      title: String,
      level: String,
      url: String,
      date: Date,
    },
  ],
});

const OpenSourceModel =
  mongoose.models.OpenSource || mongoose.model("OpenSource", OpenSourceSchema);
export default OpenSourceModel;
