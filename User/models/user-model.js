const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
});

// UserSchema.methods.createUser = function (monkey){
//     console.log("heyyyy DB Method", monkey)
//     console.log("user email = ", this.email)
// }

const user = mongoose.model("user", UserSchema);
module.exports = user;
