const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('Senha@123', 10));