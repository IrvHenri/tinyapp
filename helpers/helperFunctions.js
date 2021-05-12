const generateRandomString = function () {
  return Math.random().toString(20).substr(2, 6);
};

const createNewUser = (userParams) => {
  let id = generateRandomString();
  const { email, password } = userParams;
  // include ID, email and password
  return { id, email, password };
};

const findUserID = function (email, db) {
  for (let key in db) {
    if (db[key].email === email) {
      return db[key].id;
    }
  }
}

module.exports = {generateRandomString, createNewUser , findUserID}