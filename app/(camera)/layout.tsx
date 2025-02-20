import "../globals.css";
import Theming from "@/Theme/Theming";
import { Toaster } from "@/components/ui/toaster";

export default function CameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theming>
          <Toaster />
          <main className="h-screen">{children}</main>
        </Theming>
      </body>
    </html>
  );
}
