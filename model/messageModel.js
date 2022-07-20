const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{
        text:{
          type: String,
          required: true,
        },
       },
      users: Array,
      sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
      },
    {
    timestamp: true,
    } 
  );

module.exports = mongoose.model("Messages", messageSchema);