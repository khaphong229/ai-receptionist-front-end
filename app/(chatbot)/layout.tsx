import SharedLayout from "../layouts/SharedLayout";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayout>{children}</SharedLayout>;
}
