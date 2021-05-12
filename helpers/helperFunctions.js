const generateRandomString = function () {
  return Math.random().toString(20).substr(2, 6);
};

const createNewUser = (userParams) => {
  let id = generateRandomString();
  const { email, password } = userParams;
  // include ID, email and password
  return { id, email, password };
};

module.exports = {generateRandomString, createNewUser}