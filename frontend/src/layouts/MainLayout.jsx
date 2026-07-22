import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({ children }) {
    return (
        <div className="h-screen bg-slate-950 text-white flex">

            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">

                <Header />

                <main className="flex-1 overflow-hidden">
                    {children}
                </main>

            </div>

        </div>
    );
}