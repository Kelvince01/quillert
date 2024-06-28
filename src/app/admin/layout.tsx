import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const AdminLayout = async () => {
    const supabase = createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/accounts/login');
    }

    return <></>;
};

export default AdminLayout;
