import '../styles/globals.css';

import { withTRPC } from '@trpc/next';
import type { ServerRouter } from '@/server/router';
import Dapp from '@/utils/dapp';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
    return (
        <Dapp>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
        </Dapp>
    );
}

export default withTRPC<ServerRouter>({
    config({ ctx }) {
        //Switch when deploying.
        // EXAMPLE: const url = 'https://solana-login.vercel.app//api/trpc';
        // const url = 'https://YOURDOMAIN/api/trpc';
        const url = 'http://localhost:3000/api/trpc';

        return { url };
    }
})(App);
