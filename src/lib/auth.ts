import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
import { sendEmail } from "./email"; 
import { nextCookies } from "better-auth/next-js";
const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
        sendResetPassword: async ({user, url}) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    },
    // Session configuration
    session:{
    expiresIn:60*5, // 5 minutes
    updateAge:60*5, // 5 minutes
    cookieCacheTime:60*5, // 5 minutes
    },
    
    emailVerification:{
        sendOnSignUp:true, // Send verification email on sign up
        autoSignInAfterVerification:true, // Auto sign in the user after they verify their email
        expiresIn:60*2, // 2 minutes
        sendVerificationEmail:async ({user,token})=> {
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
            await sendEmail({
                to:user.email,
                subject:"Verify your email",
                text:`Click the link below to verify your email:\n${verificationUrl}`
            })
        }
        
    },
    

    plugins:[nextCookies()],
    socialProviders: {

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        microsoft: { 
            clientId: process.env.MICROSOFT_CLIENT_ID as string, 
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string, 
            // Optional
            tenantId: 'common', 
            requireSelectAccount: true
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID as string, 
            clientSecret: process.env.APPLE_CLIENT_SECRET as string, 
            appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string, 
        } 
    },
    trustedOrigins: ["https://appleid.apple.com"],
});