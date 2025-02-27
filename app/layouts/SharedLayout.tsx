"use client";

import "../globals.css";
import Theming from "@/Theme/Theming";
import { Toaster } from "@/components/ui/toaster";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
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

  const updateUserName = () => {
    const customerInfoStr = CustomerInfo.getCustomerInfo();
    if (customerInfoStr) {
      try {
        const customerInfo = JSON.parse(customerInfoStr);
        if (customerInfo.full_name) {
          setUserName(customerInfo.full_name);
        }
      } catch (error) {
        console.error("Error parsing customer info:", error);
      }
    }
  };

  useEffect(() => {
    // Initial load
    updateUserName();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "customerInfo") {
        updateUserName();
      }
    };

    // Custom event for when we manually set localStorage
    const handleCustomStorageChange = () => {
      updateUserName();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customerInfoUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "customerInfoUpdated",
        handleCustomStorageChange
      );
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <Theming>
          <Toaster />
          <header className="container mx-auto flex justify-between items-center p-4">
            <span className="text-2xl font-bold">Lysia</span>
            <div>
              <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                    <UserRound className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{userName}</span>
                  </button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Portal>
                  <DropdownMenuPrimitive.Content
                    className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                    align="end"
                  >
                    <DropdownMenuPrimitive.Label className="px-2 py-1.5 text-sm font-semibold">
                      My Account
                    </DropdownMenuPrimitive.Label>
                    <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />
                    <DropdownMenuPrimitive.Item
                      asChild
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Link href="/" className="w-full">
                        Home
                      </Link>
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item
                      asChild
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Link href="/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuPrimitive.Item>
                  </DropdownMenuPrimitive.Content>
                </DropdownMenuPrimitive.Portal>
              </DropdownMenuPrimitive.Root>
            </div>
          </header>
          <main className="h-screen">{children}</main>
        </Theming>
      </body>
    </html>
  );
}
