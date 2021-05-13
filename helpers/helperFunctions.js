const helperGenerator = db =>{
  const generateRandomString = function () {
    return Math.random().toString(20).substr(2, 6);
  };
  

  const findUserByEmail = (email)=>{
    for (let key in db) {
      if (db[key].email === email) {
        return true
      }
    }
    return false
  }

  const createNewUser = (userParams) => {
    if(findUserByEmail(userParams.email)){
      return {data: null , error: 'User already exists'}
    }
    let id = generateRandomString();

    const { email, password } = userParams;
    if(!email || !password ){
      return { data: null , error: 'invalid fields'}
    }
    db[id] = {id,email,password}
    // include ID, email and password
    return { data: {id,email,password} , error: null };
  };
  
  
  
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

  
  return {findUserByEmail,generateRandomString, createNewUser ,authenticateUser}
}

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