"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X, Lock, ArrowRight, Building2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { signupSchema } from "@/lib/Schemas/SignupSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

export default function SignUp() {
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema)
	});

	const onSubmit = async (data: z.infer<typeof signupSchema>) => {
		console.log(`data: ${JSON.stringify(data)}`);
		try {
			setLoading(true);
			await signUp.email({
				email: data.email,
				password: data.password,
				name: `${data.firstName} ${data.lastName}`,
				image: image ? await convertImageToBase64(image) : "",
				fetchOptions: {
					onResponse: () => {
						setLoading(true);
					},
					onError: (ctx) => {
						setLoading(false);
						toast.error(ctx.error.message);
					},
					onSuccess: async () => {
						toast.success("Account created successfully! Please check your email to verify your account.");
						setLoading(false)
						reset()
					},
				}
			})
		}
		catch (error) {
			setLoading(false);
			toast.error("An error occurred during signup");
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-md">
				<Card className="shadow-xl border-gray-200">
					<CardHeader className="border-b border-gray-100 bg-white pb-6">
						<div className="space-y-1.5 flex flex-col items-center">
							<div className="bg-blue-100 text-blue-700 p-3 rounded-full mb-2">
								<Lock className="h-6 w-6" />
							</div>
							<h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
							<p className="text-gray-500 text-center">
								Enter your information to create an account
							</p>
						</div>
					</CardHeader>

					<CardContent className="px-6 bg-white">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="first-name" className="text-gray-700">First name</Label>
									<Input
										id="first-name"
										placeholder="Max"
										{...register('firstName')}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									{errors.firstName && (
										<p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="last-name" className="text-gray-700">Last name</Label>
									<Input
										id="last-name"
										placeholder="Robinson"
										{...register('lastName')}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
									{errors.lastName && (
										<p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-700">Email Address</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									{...register('email')}
									className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
								/>
								{errors.email && (
									<p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-gray-700">Password</Label>
								<Input
									id="password"
									type="password"
									autoComplete="new-password"
									placeholder="••••••••"
									{...register('password')}
									className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
								/>
								{errors.password && (
									<p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password_confirmation" className="text-gray-700">Confirm Password</Label>
								<Input
									id="password_confirmation"
									type="password"
									autoComplete="new-password"
									placeholder="••••••••"
									{...register('passwordConfirmation')}
									className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
								/>
								{errors.passwordConfirmation && (
									<p className="text-xs text-red-500 mt-1">{errors.passwordConfirmation.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="image" className="text-gray-700">Profile Image (optional)</Label>
								<div className="flex items-end gap-4">
									{imagePreview && (
										<div className="relative w-12 h-12 rounded-sm overflow-hidden">
											<Image
												src={imagePreview}
												alt="Profile preview"
												layout="fill"
												objectFit="cover"
											/>
										</div>
									)}
									<div className="flex items-center gap-2 w-full">
										<Input
											id="image"
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
										/>
										{imagePreview && (
											<X
												className="cursor-pointer text-gray-500 hover:text-gray-700"
												onClick={() => {
													setImage(null);
													setImagePreview(null);
												}}
											/>
										)}
									</div>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-black text-white hover:bg-gray-800"
								disabled={loading}
							>
								{loading ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : null}
								Create Account
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</form>
					</CardContent>

					<CardFooter className="flex items-center justify-center p-4 bg-gray-50 border-t border-gray-100">
						<div className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link href="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
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

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}