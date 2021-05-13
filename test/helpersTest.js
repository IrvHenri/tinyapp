const {assert} = require('chai')
const { helperGenerator } = require('../helpers/helperFunctions');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
const { validateUserByEmail } =
  helperGenerator(testUsers);

  describe('validateUserByEmail', function() {
    it('should return true with valid existing user email', function() {
      const user = validateUserByEmail("user@example.com")
      const expectedOutput = true;
      
      assert.equal(user,expectedOutput);
    });
    it('should return false with non existing user email', function() {
      const user = validateUserByEmail("apples@example.com")
      const expectedOutput = false;
      
      assert.equal(user,expectedOutput);
    }),
    it('should return false with no user input email', function() {
      const user = validateUserByEmail("")
      const expectedOutput = false;
      // Write your assert statement here
      assert.equal(user,expectedOutput);
    });
  });

 
