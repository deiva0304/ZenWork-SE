import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  messages: [{
    userMessage: {
      type: String,
      required: true
    },
    botResponse: {
      type: String,
      required: true
    },
    nlpTags: [{
      type: String,
      enum: ['stress', 'anxiety', 'motivation', 'time-management', 'work-life-balance']
    }],
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;