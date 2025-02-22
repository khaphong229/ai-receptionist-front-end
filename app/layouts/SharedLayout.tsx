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

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                  <Button variant="ghost">
                    <UserRound className="w-4 h-4 mr-2" />
                    Anonymous
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/recognize">Face Recognition</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/chatbot">ChatBot</Link>
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
