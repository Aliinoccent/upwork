

var nodemailer = require('nodemailer');
var random_number = require("random-number");
require("dotenv").config();

const otp = function genrateOtp() {

  var options = {
    min: 11111
    , max: 99999
    , integer: true
  }
  var currentTime = new Date();
  console.log(currentTime.getMinutes());
  return ({ otp: random_number(options), time: currentTime.getMinutes() })
}
exports.nodemailer = async (req, res, next) => {
  const {email}= req.body;
  try {

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:process.env.SENDER,
        pass: process.env.PASSWORD_EMAIL
      }
    });
    var sentOtp = otp();
    // otpset(sentOtp);
    req.sentOtp = sentOtp
    

    var mailOptions = {
      from: process.env.SENDER,
      to:   email,
      subject: "Otp recover password",
      text: `your password will be recover using from otp 5 digits code  =>  ${sentOtp.otp}`
    };

     await transporter.sendMail(mailOptions)
    console.log("sent successflly");
    next();


  }
   catch (error) {
    console.log(error);
  }

}
