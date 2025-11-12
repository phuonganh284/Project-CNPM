import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import TopMain from "./TopMain";
import { Outlet } from "react-router-dom";
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

    return (
        <div className="flex">
            <Sidebar />
            <Background />

            <div className="flex-1 ml-[278px] min-h-screen">

                <div className="fixed bg-transparent z-50">
                    <TopMain 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm}
                        filter={filter}
                        setFilter={setFilter} 
                    />
                </div>

                <div className="pt-[108px] md:px-[26px]">
                    <div
                        className="
                            bg-[#F3F3F7]
                            h-[calc(100vh-120px)]
                            overflow-auto
                            p-4
                        "
                    >
                        <Outlet context={{ debouncedSearchTerm, filter }} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Layout;
