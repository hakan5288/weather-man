

"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// Single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    

    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
   
  );
}