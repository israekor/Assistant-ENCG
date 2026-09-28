import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({
    children,
    showSidebar = true
}) {
    return (
        <div className="h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex overflow-hidden">

            {showSidebar && <Sidebar />}

            <div className="flex flex-col flex-1 min-w-0">

                <Header showSidebar={showSidebar} />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

            </div>

        </div>
    );
}
