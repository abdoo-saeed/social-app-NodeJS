import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../../config";

 


export const sendEmail = async ({ to, subject , html}:{to:string, subject:string, html:string}) => {


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});



   await transporter.sendMail({
    from: `"Saraha App" <${EMAIL}>`,
    to,
    subject,
    html
  });



}

