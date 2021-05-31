const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    teammember: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
