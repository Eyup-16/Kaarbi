'use client'
import { useState } from 'react';
import { ArrowRight, Building2, Check, AlertCircle, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/lib/Schemas/Forgot-password';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgetPassword } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const email = watch('email', '');
  
  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setLoading(true);
      setVerifying(true);
      
      const {error} = await forgetPassword({
        email: data.email,
        redirectTo: '/reset-password',
      });
      
      if(error){
        if (error.message && error.message.includes('not found')) {
          toast.error('No account found with this email address');
        } else {
          toast.error(error.message || 'An error occurred while sending the reset email');
        }
        setLoading(false);
        setVerifying(false);
        return;
      }
      
      toast.success('Password reset email sent! Please check your inbox.');
      setSubmitted(true);
      setLoading(false);
      setVerifying(false);
    } catch (error) {
      toast.error('An error occurred while sending the reset email');
      setLoading(false);
      setVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
      
        <Card className="shadow-xl border-gray-200">
         {submitted ? (''):
          (
            <CardHeader className="border-b border-gray-100 bg-white pb-6">
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-full mb-2">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
              <p className="text-gray-500 text-center">
                No worries! Enter your email and we&apos;ll send you reset link.
              </p>
            </div>
          </CardHeader>
          )}
          
          <CardContent className="px-6 bg-white">
            {submitted ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600">
                    We&apos;ve sent password reset instructions to:
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {email}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">What&apos;s Next?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          Check your inbox for an email from KAARBI
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          Click the reset link in the email
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          Create a new password for your account
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Didn&apos;t receive the email?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          Check your spam or junk folder
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          Make sure the email address is correct
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          Wait a few minutes and try again
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => setSubmitted(false)}
                    disabled={loading || verifying}
                  >
                    {loading || verifying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Resend Email
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Link href="/login" className="flex items-center justify-center w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="name@example.com"
                      {...register('email')}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading || verifying}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={loading || verifying}
                  >
                    {loading || verifying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {verifying ? 'Verifying Email...' : 'Send Reset Instructions'}
                    {!loading && !verifying && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </form>
                
                <div className="text-center pt-2">
                  <Button 
                    variant="link" 
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    <Link href="/login" className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      <span>Back to Login</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex items-center justify-center p-4 bg-gray-50 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Need help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center">
          <Building2 className="h-3 w-3 mr-1" />
          <span>KAARBI Cars Repository • One Market Plaza, San Francisco, CA 94105</span>
        </div>
      </div>
    </div>
  );
}