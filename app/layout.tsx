import "./globals.css";
import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/react-query-provider";

export const metadata = {
  title: "Next Todo",
  description: "Todo app with Prisma + React Query",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ReactQueryProvider>
          <div className="max-w-xl mx-auto p-6">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}


