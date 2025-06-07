import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { sendEmail } from "./email"; 
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";

const prisma = new PrismaClient();

// Define our custom permissions
const statement = {
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
  session: ["list", "revoke", "delete"],
  car: ["approve", "delete", "list-all", "ban-listing"]
} as const;

// Create access control
export const ac = createAccessControl(statement);

// Define roles with permissions
export const adminRole = ac.newRole({
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
  session: ["list", "revoke", "delete"],
  car: ["approve", "delete", "list-all", "ban-listing"]
});

export const moderatorRole = ac.newRole({
  user: ["list"],
  session: ["list"],
  car: ["approve", "list-all"]
});

export const userRole = ac.newRole({
  car: ["list-all"]
});

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "development-secret-change-in-production",
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
    // Session configuration - more secure approach
    session:{
        expiresIn: 60*60*24, // 1 day - session duration
        updateAge: 60*60, // 1 hour 
        cookieCache:{
            enabled: false, // Disable cookie caching for security
        },
        // Only include essential user data in the session
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true
        }
    },
    
    emailVerification:{
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        expiresIn:60*5,
        sendVerificationEmail:async ({user,token}, request)=> {
            // Only block verification emails if it's specifically a signin attempt with email/password
            const isSignInAttempt = request?.url?.includes('/sign-in/email');
            
            if (isSignInAttempt) {
                console.log(`Blocked verification email resend on signin failure for ${user.email}`);
                return; // Never send verification emails on failed signin attempts
            }
            
            // Send verification emails for signup and manual verification requests
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`;
            await sendEmail({
                to:user.email,
                subject:"Verify your email",
                text:`Click the link below to verify your email:\n${verificationUrl}`
            })
            
            console.log(`Verification email sent to ${user.email}`);
        }
        
    },
    

    plugins:[
        nextCookies(),
        admin({
            ac,
            roles: {
                admin: adminRole,
                moderator: moderatorRole,
                user: userRole
            },
            defaultRole: "user",
            adminRoles: ["admin", "moderator"],
            impersonationSessionDuration: 60 * 60, // 1 hour
            defaultBanReason: "Violation of terms of service",
            bannedUserMessage: "Your account has been banned. Please contact support if you believe this is an error."
        })
    ],
    socialProviders: {
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID, 
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }
        }),
        ...(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET && {
            microsoft: { 
                clientId: process.env.MICROSOFT_CLIENT_ID, 
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET, 
                tenantId: 'common'
            }
        }),
        ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET && {
            apple: {
                clientId: process.env.APPLE_CLIENT_ID, 
                clientSecret: process.env.APPLE_CLIENT_SECRET, 
                appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string, 
            }
        })   
    },
    trustedOrigins: ["https://appleid.apple.com","https://kaarbi.vercel.app"],
});