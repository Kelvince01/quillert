import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const AdminHomepage = async () => {
    const supabase = createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    return <></>;
};

export default AdminHomepage;
