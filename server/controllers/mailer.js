import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';


let nodeConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // real gmail user id
        pass: ENV.PASSWORD, // real gmail password
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {

    const { username, userEmail, text, subject } = req.body;
    console.log('REGISTER::', req.body);

    // if (!username || !userEmail || !text) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Please Provide All Credentials"
    //     })
    // }

    // body of the email
    const email = {
        body: {
            name: username,
            intro: text || `Welcome ${username}  We're very excited to have you on board.`,
            outro: `Need help, or have questions? Just reply to this email, we'd love to help.`
        }
    }

    // const emailBody = MailGenerator.generate(email);
    const emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    // send mail
    try {
        console.log('REGISTER MAIL BEFORE::', message);
        let data = await transporter.sendMail(message)
        console.log('REGISTER MAIL AFTER::', data);
        return res.status(200).json({
            success: true,
            message: "You should receive an email from us."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Encountered An Error While Sending Email",
            error
        })
    }

}








// import nodemailer from 'nodemailer';
// import Mailgen from 'mailgen';

// import ENV from '../config.js';


// // https://ethereal.email/create
// let nodeConfig = {
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: ENV.EMAIL, // generated ethereal user
//         pass: ENV.PASSWORD, // generated ethereal password
//     }
// }

// let transporter = nodemailer.createTransport(nodeConfig);

// let MailGenerator = new Mailgen({
//     theme: "default",
//     product : {
//         name: "Mailgen",
//         link: 'https://mailgen.js/'
//     }
// })

// /** POST: http://localhost:8080/api/registerMail 
//  * @param: {
//   "username" : "example123",
//   "userEmail" : "admin123",
//   "text" : "",
//   "subject" : "",
// }
// */
// export const registerMail = async (req, res) => {
//     const { username, userEmail, text, subject } = req.body;

//     // body of the email
//     var email = {
//         body : {
//             name: username,
//             intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
//             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//         }
//     }

//     var emailBody = MailGenerator.generate(email);

//     let message = {
//         from : ENV.EMAIL,
//         to: userEmail,
//         subject : subject || "Signup Successful",
//         html : emailBody
//     }

//     // send mail
//     transporter.sendMail(message)
//         .then(() => {
//             return res.status(200).send({ msg: "You should receive an email from us."})
//         })
//         .catch(error => res.status(500).send({ error }))

// }