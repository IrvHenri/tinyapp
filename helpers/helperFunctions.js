const bcrypt = require('bcrypt');
const saltRounds = 10;

// Parent helper function to provide db resource to all child functions. Took advantage of closure.
const helperGenerator = db =>{
  const generateRandomString = function () {
    return Math.random().toString(20).substr(2, 6);
  };
  
  const validateUserByEmail = (email)=>{
    for (let key in db) {
      if (db[key].email === email) {
        return true
      }
    }
    return false
  }

  const createNewUser = (userParams) => {
    if(validateUserByEmail(userParams.email)){
      return {data: null , error: 'User already exists'}
    }
    
    const { email, password } = userParams;
    if(!email || !password ){
      return { data: null , error: 'invalid fields'}
    }
    // To create a new user, create a random string id
      // Then we hash the provided password with the bcrypt dependency
    let id = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    // Add the new created user to the db
    db[id] = {id,email, password: hashedPassword}
    return { data: {id,email,password: hashedPassword} , error: null };
  };
  
  const authenticateUser = (userParams) => {
    const { email, password } = userParams
    
    for (const user in db) {
         
      if (db[user].email  === email) {
        //Compare provided email with hashed password, bcrypt compare function used to validate
        if ( bcrypt.compareSync(password, db[user].password )) {
          
          return { data: db[user], error: null }
        }
        return { data: null, error: "Incorrect password" }
  
      }
    }
    return { data: null, error: "Incorrect email" }
  }

  return {validateUserByEmail,generateRandomString, createNewUser ,authenticateUser}
}

// Helper function that needs the url db instead
  // Will filter the urls belonging to the logged in user.
const urlsForUser = (id,db)=>{
  let urls = {}
  for(let key in db){
    
    if(db[key].userID === id){
      
      urls[key] = db[key]
    }
  }
  return urls
}



module.exports = {helperGenerator, urlsForUser}