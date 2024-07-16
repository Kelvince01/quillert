import { ScrollArea } from '@/components/ui/scroll-area';

const AdminHomepage = async () => {
    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
                </div>
            </div>
        </ScrollArea>
    );
};

export default AdminHomepage;
