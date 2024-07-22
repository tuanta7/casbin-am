const bcrypt = require("bcrypt");
const saltRounds = 10; // Default cost
const password = "heimdall";

const hashedPassword = bcrypt.hashSync(password, saltRounds);
console.log(hashedPassword);
