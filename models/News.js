import mongoose from 'mongoose';

const News = mongoose.model(
  'News',
  mongoose.Schema(
    {
      title: String,
      body: String,
      category: String,
      author: String,
      userId: mongoose.ObjectId,
    },
    { timestamps: true },
  ),
);

export default News;
