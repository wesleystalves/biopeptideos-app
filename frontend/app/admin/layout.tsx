import Sidebar from "./Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin — BioPeptidios",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="sticky top-0 z-10 h-14 border-b border-white/5 bg-brand-950/60 backdrop-blur-sm flex items-center px-6 md:pl-6 pl-16">
                    <div className="ml-auto flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                            A
                        </div>
                    </div>
                </div>
                <div className="p-4 md:p-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}

