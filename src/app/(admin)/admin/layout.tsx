import { TRPCProvider } from "../../../trpc/client";

export default function RootLayout({ children }: any) {
  return (
    <TRPCProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </TRPCProvider>
  );
}
