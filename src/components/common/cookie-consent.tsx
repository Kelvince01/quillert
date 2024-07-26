export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import DismissButton from './dismiss-button';
import { Cookie } from 'lucide-react';

export default function Toast() {
    const cookieStore = cookies();
    const isHidden = cookieStore.get('cookies-consent');

    return isHidden ? null : (
        <div className="sticky rounded-2xl w-11/12 sm:w-[581px] h-40 sm:h-[80px] p-0.5 z-10 bottom-10 left-0 right-0 mx-auto">
            <div className="rounded-[14px] w-full h-full bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-3 sm:space-y-0 px-5">
                <p className="text-black text-[13px] font-mono w-[420px] h-10 flex items-center justify-center p-3">
                    This website uses cookies to enhance the user experience. <DismissButton />
                </p>
                <Cookie
                    color="#a3540a"
                    strokeWidth={1}
                    className="transition-all rounded-md w-[100px] h-10 flex items-center justify-end whitespace-nowrap"
                />
            </div>
        </div>
    );
}
