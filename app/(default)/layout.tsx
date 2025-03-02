import Theming from "@/Theme/Theming";
import "../globals.css";
import Headpage from "@/app/Header/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theming>
          <Headpage />
          <main>{children}</main>
        </Theming>
      </body>
    </html>
  );
}
