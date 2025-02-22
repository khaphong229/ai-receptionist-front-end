import * as React from "react";

declare module "@radix-ui/react-tabs" {
  interface TabsContentProps {
    children: React.ReactNode;
    value: string;
    className?: string;
  }

  interface TabsListProps {
    children: React.ReactNode;
    className?: string;
  }

  interface TabsTriggerProps {
    children: React.ReactNode;
    value: string;
    className?: string;
  }
}
