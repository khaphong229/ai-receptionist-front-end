import SharedLayout from "../layouts/SharedLayout";

export default function CameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
