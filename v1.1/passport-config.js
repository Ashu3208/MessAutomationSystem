const LocalStrategy = require("passport-local").Strategy
const bcrypt= require("bcrypt")
const MongoClient = require("mongodb").MongoClient;
function initialize (passport,getUserbyEmail,getUserbyId){
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
          try {
            const client = await MongoClient.connect('mongodb://localhost:27017');
            const db = client.db('mydb');
            const users = db.collection('users');
            const user = await users.findOne({ email: email });
    
            if (!user) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }
    
            if (!await bcrypt.compare(password, user.password)) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }
    
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        })
      );
    
      passport.serializeUser((user, done) => done(null, user.id));
    
      passport.deserializeUser(async (id, done) => {
        try {
          const client = await MongoClient.connect('mongodb://localhost:27017');
          const db = client.db('mydb');
          const users = db.collection('users');
          const user = await users.findOne({ id: id });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      });
    };


module.exports =initialize