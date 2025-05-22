'use server'

import nodemailer from "nodemailer";

export  const sendEmail = async ({to ,subject,text}:{to:string,subject:string, text:string})=>{
    const transporter = nodemailer.createTransport({
        host:'localhost',
        port:1025,
        secure:false,
        ignoreTLS:true,
    });
    const devform = 'dev@localhost.co'

    try{
        const info = await transporter.sendMail({
            from:devform,
            to: to.toLocaleLowerCase().trim(),
            subject:subject.trim(),
            text:text.trim(),
        })
    
    console.log("Email sent (dev mode):", info.messageId);
    console.log("Preview URL: http://localhost:1080"); // MailDev web interface

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Is your local MailDev/MailHog running?",
    };
  }

}