'use client';

import { ApolloProvider } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { graphqlClient } from '@/src/graphql/gql.setup';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={graphqlClient}>
      <SessionProvider>
        <NextUIProvider>
          <NextThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </NextThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
