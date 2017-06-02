var bcrypt = require('bcrypt');


exports.generate = function(str) {
  var hash = bcrypt.hashSync(str, 10);
  return hash

}


exports.compare = function(hash, str){
  return bcrypt.compareSync(str, hash);
}
