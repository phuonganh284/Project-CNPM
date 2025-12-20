import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import TopMain from "./TopMain";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import Background from "./Background";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Background />

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="flex-1 lg:ml-[278px] min-h-screen transition-all duration-300">

                <header className="fixed top-0 left-0 lg:left-[278px] right-0 z-50 transition-all duration-300">
                    <TopMain
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filter={filter}
                        setFilter={setFilter}
                        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    />
                </header>

                <main className="pt-[100px] px-4 md:px-6 pb-4">
                    <div
                        className="
                            bg-white
                            h-[calc(100vh-116px)]
                            overflow-auto
                            rounded-2xl
                            p-4
                        "
                    >
                        <ErrorBoundary>
                            <Outlet context={{ debouncedSearchTerm, filter }} />
                        </ErrorBoundary>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Layout;
