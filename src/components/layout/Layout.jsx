import React from "react";
import Sidebar from "./Sidebar";
import TopMain from "./TopMain";
import { Outlet } from "react-router-dom";
import Background from "./Background";

const Layout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <Background />

            <div className="flex-1 ml-[278px] min-h-screen">

                <div className="fixed bg-transparent">
                    <TopMain />
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
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Layout;
