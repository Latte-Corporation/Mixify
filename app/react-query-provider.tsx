"use client";
 
import React, { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
 
 
export function ReactQueryProvider({ children }: React.PropsWithChildren) {
    const [client, setClient] = useState(new QueryClient())

    useEffect(() => {
        setClient(new QueryClient())
    }, [])
 
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}