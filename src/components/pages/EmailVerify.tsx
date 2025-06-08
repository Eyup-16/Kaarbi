'use client'
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type VerificationStatus = 'loading' | 'success' | 'error' | 'unauthorized';

interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

export default function EmailVerify() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const timeoutRef = useRef<number | null>(null);
  
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    // Redirect if no verification token is provided
    if (!token) {
      router.push('/login');
      return;
    }

    const verifyEmail = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          let errorMessage = 'Verification failed';
          try {
            const errorData: VerifyEmailResponse = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // JSON parsing failed, use default message
          }
          throw new Error(errorMessage);
        }

        setVerificationStatus('success');
        
        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
        
        // Redirect to dashboard after 3 seconds
        timeoutRef.current = window.setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
        
      } catch (error) {
        setVerificationStatus('error');
        const message = error instanceof Error 
          ? error.message 
          : 'Failed to verify email. Please try again or contact support.';
        setErrorMessage(message);
      }
    };

    verifyEmail();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [searchParams, router]);

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'loading' && 'Verifying your email...'}
            {verificationStatus === 'success' && 'Your email has been verified successfully!'}
            {verificationStatus === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            {verificationStatus === 'loading' && (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          
          {verificationStatus === 'error' && (
            <p className="text-center text-red-500">{errorMessage}</p>
          )}
          
          {verificationStatus === 'success' && (
            <p className="text-center text-green-500">
              You will be redirected to the dashboard shortly...
            </p>
          )}
          
          <div className="flex justify-center gap-4">
            {verificationStatus === 'error' && (
              <>
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Back to Login
                </Button>
                <Button onClick={() => router.push('/contact')}>
                  Contact Support
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}