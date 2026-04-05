import { ReactNode } from "react";

interface AgoraAILayoutProps {
  children: ReactNode;
}

export default function AgoraAILayout({ children }: AgoraAILayoutProps) {
  return <div>{children}</div>;
}
