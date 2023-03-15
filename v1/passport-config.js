const LocalStrategy = require("passport-local").Strategy
const bcrypt= require("bcrypt")

function initialize (passport,getUserbyEmail,getUserbyId){
    const authenticateUsers = async(email,password,done)=> {
        //Get users by email
        const user =getUserbyEmail(email)
        if(user==null){
            return done(null,false,{message:"No user found with that email"})
        }
        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message:"Password Incorrect"})

            }
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }
    passport.use(new LocalStrategy( {usernameField: 'email'},authenticateUsers))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getUserbyId(id))
    })
}

module.exports =initialize