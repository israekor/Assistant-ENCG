import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({ 
    children,
    showSidebar = true
}) {
    return (
        <div className="h-screen bg-slate-950 text-white flex">

            {
                showSidebar &&

                <Sidebar />
            }

            <div className="flex flex-col flex-1">

                <Header />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

            </div>

        </div>
    );
}