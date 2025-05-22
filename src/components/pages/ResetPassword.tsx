'use client'
import { useState } from 'react';
import { ShieldCheck, ArrowRight, Building2, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from '@/lib/Schemas/ResetPassword';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const password = watch('password', '');
  // const confirmPassword = watch('confirmPassword', '');

const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get('token');



  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculateStrength(password);
  
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    setSubmitted(true);
    try {
      const response = await resetPassword({
        newPassword: data.password,
        token: token!,
      });
      
      if ('error' in response && response.error?.message) {
        toast.error(response.error.message);
        setLoading(false);
        setSubmitted(false);
        return;
      }
      
      toast.success('Password reset successfully! login to continue.');
      setLoading(false);
      router.push('/login');
    } catch (error) {
      toast.error('An error occurred while resetting your password');
      setLoading(false);
      setSubmitted(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center">
              <ShieldCheck className="h-12 w-12 text-purple-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your new password below
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your password has been reset successfully.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleLoginRedirect}
                  className="w-full bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Go to Login
                  {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('password')}
                      className="border-gray-300 pr-10 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>
                
                {password && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 50 ? 'text-red-500' : 
                        passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={passwordStrength} 
                        className="h-1 bg-gray-200"
                      />
                      <div 
                        className={`absolute top-0 left-0 h-1 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <ul className="text-xs text-gray-500 pt-2 space-y-1">
                      <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                        <Check className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                        <Check className={`h-3 w-3 mr-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One uppercase letter
                      </li>
                      <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                        <Check className={`h-3 w-3 mr-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One number
                      </li>
                      <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}`}>
                        <Check className={`h-3 w-3 mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One special character
                      </li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className={`border-gray-300 pr-10 focus:border-purple-500 focus:ring-purple-500 ${
                        errors.confirmPassword ? 'border-red-300' : ''
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Reset Password
                  {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex items-center justify-center p-4 bg-gray-50 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Need help? <a href="#" className="text-purple-600 font-medium hover:underline">Contact Support</a>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center">
          <Building2 className="h-3 w-3 mr-1" />
          <span>KAARBI Creative Technology • 101 Market Street, San Francisco, CA 94105</span>
        </div>
      </div>
    </div>
  );
}