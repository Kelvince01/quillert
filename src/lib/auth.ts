import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const signUp = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    // Step 1: Sign up the user
    const {
        data: { user },
        error
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                firstname: firstname,
                lastname: lastname
            }
        }
    });

    if (error) {
        return redirect('/accounts/register?message=Could not register user');
    }

    // Step 2: If signup successful, insert additional data into a 'profiles' table
    if (user) {
        const { error: profileError } = await supabase.from('users').insert({
            id: user.id, // use the user's ID as the profile ID
            name: `${firstname} ${lastname}`,
            email: user.email
        });

        if (profileError) {
            return redirect('/accounts/register?message=Could not create user');
        }
    }

    return redirect('/accounts/register?message=Check email to continue sign in process');
};
