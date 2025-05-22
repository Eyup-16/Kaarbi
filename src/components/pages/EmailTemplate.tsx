'use client'
import { useState } from 'react';
import { Check, Mail, ArrowRight, Building2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';



export default function EmailVerificationCard ({verificationUrl}:{verificationUrl:URL}) {
  const [verified, setVerified] = useState(false);
  
  const handleVerify = () => {
    setVerified(true);
    // In a real application, this would trigger an API call
  };
  
  return (
    <div className="flex items-center justify-center w-full p-4">
      <Card className="max-w-md w-full overflow-hidden shadow-xl border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 space-y-4 border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-md">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight">ATLAS</span>
                <span className="text-blue-100 text-xs">DIGITAL SOLUTIONS</span>
              </div>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30">Secure</Badge>
          </div>
          
          <div className="text-center pt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-white text-2xl font-bold">Verify Your Email</h2>
            <p className="text-blue-100 mt-2">Please verify your email address to continue</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 bg-white">
          {verified ? (
            <div className="text-center">
              <Alert className="bg-green-50 text-green-700 border-green-200 mb-6">
                <Check className="h-5 w-5" />
                <AlertTitle>Email Verified Successfully</AlertTitle>
                <AlertDescription>
                  Thank you for verifying your email address.
                </AlertDescription>
              </Alert>
              
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 font-medium"
                onClick={() => window.location.href="#dashboard"}
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-6">
                We&apos;ve sent a verification link to <span className="font-semibold">john.doe@example.com</span>. 
                Click the button below to verify instantly or check your inbox to complete verification.
              </p>
              
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 font-medium"
                onClick={handleVerify}>
                <Link href={verificationUrl}>
                Verify Email Address
                <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Didn&apos;t receive an email? <a href="#" className="text-blue-600 font-medium hover:underline">Resend verification</a>
                </p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col items-center p-0 bg-gray-50">
          <div className="w-full px-6 py-4 flex items-center justify-center">
            <p className="text-sm text-gray-600">Need help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a></p>
          </div>
          
          <Separator className="w-full" />
          
          <div className="w-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500 text-xs font-medium">ATLAS</span>
            </div>
            <p className="text-xs text-gray-500">One Market Plaza, San Francisco, CA 94105</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}