export const metadata = {
  layout: false,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children; // Renders without shared layout
}
