"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../app/utils/trpcClient";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import "../app/globals.css";

export default function RootLayout({ children }: any) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );
  return (
    <html>
      <body>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}
