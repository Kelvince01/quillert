'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        email: ''
    };
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    const onSubmit = async (data: UserFormValue) => {
        const {
            data: { user },
            error
        } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname
                }
            }
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Register Failed',
                description: 'Could not register user'
            });
        }

        // Step 2: If signup successful, insert additional data into a 'profiles' table
        if (user) {
            const { error: profileError } = await supabase.from('users').insert({
                id: user.id, // use the user's ID as the profile ID
                name: `${data.firstname} ${data.lastname}`,
                email: user.email
            });

            if (profileError) {
                toast({
                    variant: 'destructive',
                    title: 'Register Failed',
                    description: 'Could not create user'
                });
            }
        }

        toast({
            title: 'Register Successful',
            description: 'Check email to continue sign in process'
        });
    };

    const handleGitHubSignUp = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;

            // The user will be redirected to GitHub for authentication
        } catch (error) {
            console.error('Error signing up with GitHub:', error);
            alert(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John"
                                                    disabled={loading}
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Doe"
                                                    disabled={loading}
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="m@example.com"
                                                disabled={loading}
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                disabled={loading}
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" aria-disabled={loading} className="w-full">
                            {loading ? 'Signing Up...' : 'Create an account'}
                        </Button>
                    </form>
                </Form>

                <Button variant="outline" className="w-full mt-4" onClick={handleGitHubSignUp}>
                    Sign up with GitHub
                </Button>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/accounts/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
