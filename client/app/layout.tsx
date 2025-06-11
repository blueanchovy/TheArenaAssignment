"use client";

import Header from "./(components)/Header";
import { LeftSidebar } from "./(components)/LeftSidebar";
import { RightSidebar } from "./(components)/RightSidebar";
import "./globals.css";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("./providers").then((mod) => mod.Providers));


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
          <body>
            <Providers>
              <Header />
              <div className="flex flex-row h-[calc(100vh-65px)] w-full justify-between">
                <LeftSidebar />
                {children}
                <RightSidebar />
              </div>
            </Providers>
          </body>
        </html>
  );
}
