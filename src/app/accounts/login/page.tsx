'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleSignInButton from '@/components/accounts/github-auth-button';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function Login() {
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
        const { data: user, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Could not authenticate user'
            });
        }

        if (user.user?.role == 'authenticated') {
            return router.push('/admin');
        }

        return router.push('/');
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                                        <FormLabel>
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                <Link
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                        </FormLabel>
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
                            {loading ? 'Signing In...' : 'Login'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/accounts/register" className="underline">
                        Sign up
                    </Link>
                </div>

                {/*<Button variant="outline" className="mt-4 w-full">*/}
                {/*    Login with Google*/}
                {/*</Button>*/}

                <div className="relative mt-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <GoogleSignInButton />

                <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{' '}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </CardContent>
        </Card>
    );
}
