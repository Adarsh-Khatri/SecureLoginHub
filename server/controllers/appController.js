import UserModel from '../model/User.model.js'
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';


/* middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).json({ 
                success: false,
                message:"Can't Find User!"
             });
        }
        next();

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Authentication Error"
        });
    }
}


/* POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "admin123",
  "password" : "admin123",
  "email": "admin@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req,res){

    try {

        const { username, password, profile, email } = req.body;  

        console.log('REGISTER::',req.body);
        
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message:"Please Provide All Credentials"
            })
        }

        // check the existing user
        let existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Unique Username"
            })
        }

        // check for existing email
        let existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Unique Email"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await UserModel.create({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });    

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Encountered Error While Registering User",
            error
        });
    }
}


/* POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "admin123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    if (!username || !password ) {
        return res.status(400).json({
            success: false,
            message: "Please Provide All Credentials"
        })
    }

    try {

        let user = await UserModel.findOne({ username }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Is Not Registered"
            })
        }

        let isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password Does Not Match"
            })
        }

        // JWT 
        const jwtPayload = {
            userId: user._id,
            username: user.username
        };
        const token = jwt.sign(jwtPayload, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            success:true,
            message: "Login Successful...!",
            username: user.username,
            token
        }); 
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Encountered Error While Login User",
            error
        });
    }
}


/* GET: http://localhost:8080/api/user/admin123 */
export async function getUser(req, res) {
    
    
    const { username } = req.params;
    
    if (!username) {
        return res.status(501).json({
            success: false,
            message:"Invalid Username"
        })
    }
    
    try {
        let user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(501).json({
                success: false,
                message:"Couldn't Find User"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Information",
            user
        })        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"Server Encounter Error While Finding User Data"
        })
    }

}


/* PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // Request Object Modified By JWT Auth
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Id Not Found"
            })
        }

        // update the data
        let user = await UserModel.findByIdAndUpdate(userId, { ...req.body },{new:true});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            })
        }       
        return res.status(201).json({
            success: true,
            message: "User Updated...",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Encounter an Error While Updating User",
            error
        })
    }
}


/* GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).json({
        success: true,
        code: req.app.locals.OTP
    })
}


/* GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    console.log('VERIFY CODE::',code);
    if(!(parseInt(req.app.locals.OTP) === parseInt(code))){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).json({
        success: true,
        message: 'Verified Successfully...'
    })
}


// successfully redirect user when OTP is valid
/* GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(!req.app.locals.resetSession){
       return res.status(440).json({
           success: false,
           error: "Session Expired!"
       })
    }
    return res.status(201).json({
        success: true,
        message: "Access Granted",
        flag: req.app.locals.resetSession
    })
}


// update the password when we have valid session
/* PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if (!req.app.locals.resetSession) {
            return res.status(440).json({
                success: false,
                message: "Session Expired!"
            });
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message:"Please Provide All Credentials"
            })
        }

        let existingUser = await UserModel.findOne({ username });   

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Username Not Found"
            })
        }   

        const hashedPassword = await bcrypt.hash(password, 10); 

        let user = await UserModel.findByIdAndUpdate(existingUser._id, { password: hashedPassword }, { new: true });  
        
        req.app.locals.resetSession = false; // reset session
        return res.status(201).json({
            success: true,
            message: "User Updated...",
            user
        })

    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"Server Encountered an Error While Resetting Password",
            error
        })
    }
}




































// import UserModel from '../model/User.model.js'
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import ENV from '../config.js'
// import otpGenerator from 'otp-generator';

// /* middleware for verify user */
// export async function verifyUser(req, res, next){
//     try {
        
//         const { username } = req.method == "GET" ? req.query : req.body;

//         // check the user existance
//         let exist = await UserModel.findOne({ username });
//         if(!exist) return res.status(404).send({ error : "Can't find User!"});
//         next();

//     } catch (error) {
//         return res.status(404).send({ error: "Authentication Error"});
//     }
// }


// /* POST: http://localhost:8080/api/register 
//  * @param : {
//   "username" : "example123",
//   "password" : "admin123",
//   "email": "example@gmail.com",
//   "firstName" : "bill",
//   "lastName": "william",
//   "mobile": 8009860560,
//   "address" : "Apt. 556, Kulas Light, Gwenborough",
//   "profile": ""
// }
// */
// export async function register(req,res){

//     try {
//         const { username, password, profile, email } = req.body;        

//         // check the existing user
//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }, function(err, user){
//                 if(err) reject(new Error(err))
//                 if(user) reject({ error : "Please use unique username"});

//                 resolve();
//             })
//         });

//         // check for existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }, function(err, email){
//                 if(err) reject(new Error(err))
//                 if(email) reject({ error : "Please use unique Email"});

//                 resolve();
//             })
//         });


//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if(password){
//                     bcrypt.hash(password, 10)
//                         .then( hashedPassword => {
                            
//                             const user = new UserModel({
//                                 username,
//                                 password: hashedPassword,
//                                 profile: profile || '',
//                                 email
//                             });

//                             // return save result as a response
//                             user.save()
//                                 .then(result => res.status(201).send({ msg: "User Register Successfully"}))
//                                 .catch(error => res.status(500).send({error}))

//                         }).catch(error => {
//                             return res.status(500).send({
//                                 error : "Enable to hashed password"
//                             })
//                         })
//                 }
//             }).catch(error => {
//                 return res.status(500).send({ error })
//             })


//     } catch (error) {
//         return res.status(500).send(error);
//     }

// }


// /* POST: http://localhost:8080/api/login 
//  * @param: {
//   "username" : "example123",
//   "password" : "admin123"
// }
// */
// export async function login(req,res){
   
//     const { username, password } = req.body;

//     try {
        
//         UserModel.findOne({ username })
//             .then(user => {
//                 bcrypt.compare(password, user.password)
//                     .then(passwordCheck => {

//                         if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

//                         // create jwt token
//                         const token = jwt.sign({
//                                         userId: user._id,
//                                         username : user.username
//                                     }, ENV.JWT_SECRET , { expiresIn : "24h"});

//                         return res.status(200).send({
//                             msg: "Login Successful...!",
//                             username: user.username,
//                             token
//                         });                                    

//                     })
//                     .catch(error =>{
//                         return res.status(400).send({ error: "Password does not Match"})
//                     })
//             })
//             .catch( error => {
//                 return res.status(404).send({ error : "Username not Found"});
//             })

//     } catch (error) {
//         return res.status(500).send({ error});
//     }
// }


// /* GET: http://localhost:8080/api/user/example123 */
// export async function getUser(req,res){
    
//     const { username } = req.params;

//     try {
        
//         if(!username) return res.status(501).send({ error: "Invalid Username"});

//         UserModel.findOne({ username }, function(err, user){
//             if(err) return res.status(500).send({ err });
//             if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

//             /* remove password from user */
//             // mongoose return unnecessary data with object so convert it into json
//             const { password, ...rest } = Object.assign({}, user.toJSON());

//             return res.status(201).send(rest);
//         })

//     } catch (error) {
//         return res.status(404).send({ error : "Cannot Find User Data"});
//     }

// }


// /* PUT: http://localhost:8080/api/updateuser 
//  * @param: {
//   "header" : "<token>"
// }
// body: {
//     firstName: '',
//     address : '',
//     profile : ''
// }
// */
// export async function updateUser(req,res){
//     try {
        
//         // const id = req.query.id;
//         const { userId } = req.user;

//         if(userId){
//             const body = req.body;

//             // update the data
//             UserModel.updateOne({ _id : userId }, body, function(err, data){
//                 if(err) throw err;

//                 return res.status(201).send({ msg : "Record Updated...!"});
//             })

//         }else{
//             return res.status(401).send({ error : "User Not Found...!"});
//         }

//     } catch (error) {
//         return res.status(401).send({ error });
//     }
// }


// /* GET: http://localhost:8080/api/generateOTP */
// export async function generateOTP(req,res){
//     req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
//     res.status(201).send({ code: req.app.locals.OTP })
// }


// /* GET: http://localhost:8080/api/verifyOTP */
// export async function verifyOTP(req,res){
//     const { code } = req.query;
//     if(parseInt(req.app.locals.OTP) === parseInt(code)){
//         req.app.locals.OTP = null; // reset the OTP value
//         req.app.locals.resetSession = true; // start session for reset password
//         return res.status(201).send({ msg: 'Verify Successsfully!'})
//     }
//     return res.status(400).send({ error: "Invalid OTP"});
// }


// // successfully redirect user when OTP is valid
// /* GET: http://localhost:8080/api/createResetSession */
// export async function createResetSession(req,res){
//    if(req.app.locals.resetSession){
//         return res.status(201).send({ flag : req.app.locals.resetSession})
//    }
//    return res.status(440).send({error : "Session expired!"})
// }


// // update the password when we have valid session
// /* PUT: http://localhost:8080/api/resetPassword */
// export async function resetPassword(req,res){
//     try {
        
//         if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

//         const { username, password } = req.body;

//         try {
            
//             UserModel.findOne({ username})
//                 .then(user => {
//                     bcrypt.hash(password, 10)
//                         .then(hashedPassword => {
//                             UserModel.updateOne({ username : user.username },
//                             { password: hashedPassword}, function(err, data){
//                                 if(err) throw err;
//                                 req.app.locals.resetSession = false; // reset session
//                                 return res.status(201).send({ msg : "Record Updated...!"})
//                             });
//                         })
//                         .catch( e => {
//                             return res.status(500).send({
//                                 error : "Enable to hashed password"
//                             })
//                         })
//                 })
//                 .catch(error => {
//                     return res.status(404).send({ error : "Username not Found"});
//                 })

//         } catch (error) {
//             return res.status(500).send({ error })
//         }

//     } catch (error) {
//         return res.status(401).send({ error })
//     }
// }

