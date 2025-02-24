"use client";

import "../globals.css";
import Theming from "@/Theme/Theming";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { CustomerInfo } from "@/utils/localStorage";
import { useEffect, useState } from "react";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState<string>("Anonymous");

  useEffect(() => {
    const customerInfoStr = CustomerInfo.getCustomerInfo();
    if (customerInfoStr) {
      try {
        const customerInfo = JSON.parse(customerInfoStr);
        console.log(customerInfo);

        if (customerInfo.full_name) {
          setUserName(customerInfo.full_name);
        }
      } catch (error) {
        console.error("Error parsing customer info:", error);
      }
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Theming>
          <Toaster />
          <header className="container mx-auto flex justify-between items-center p-4">
            <span className="text-2xl font-bold">Lysia</span>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserRound className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="w-full">
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="h-screen">{children}</main>
        </Theming>
      </body>
    </html>
  );
}
