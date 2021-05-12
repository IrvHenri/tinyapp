const generateRandomString = function () {
  return Math.random().toString(20).substr(2, 6);
};

const createNewUser = (userParams) => {
  let id = generateRandomString();
  const { email, password } = userParams;
  // include ID, email and password
  return { id, email, password };
};

const isExistingUser = (email,db)=>{
  for (let key in db) {
    if (db[key].email === email) {
      return true
    }
  }
  return false
}

const authenticateUser = (userParams,db) => {
  const { email, password } = userParams
  for (const user in db) {
       
    if (db[user].email === email) {
      if (db[user].password === password) {
        return { data: db[user], error: null }
      }
      return { data: null, error: "Incorrect password" }

    }
  }
  return { data: null, error: "Incorrect email" }
}

module.exports = {isExistingUser,generateRandomString, createNewUser ,authenticateUser}