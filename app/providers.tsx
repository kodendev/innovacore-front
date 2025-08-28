"use client";
import { Toaster } from "sonner"; // ✅ Esto es el original
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          expand={true}
          closeButton={true}
          position="top-right"
          richColors
        />
      </QueryClientProvider>
    </AuthProvider>
  );
}
