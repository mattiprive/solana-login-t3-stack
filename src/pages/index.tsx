import type { NextPage } from 'next';
import React, { useEffect, ReactElement } from 'react';
import { trpc } from '@/utils/trpc';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { sign } from 'tweetnacl';
import bs58 from 'bs58';
import { Role } from '@prisma/client';

const Home: NextPage = () => {
    const { connected, publicKey, signMessage, disconnect } = useWallet();
    const session = useSession();
    const { data: roleraw, refetch } = trpc.useQuery(['role']);
    const role: Role | undefined = roleraw?.role;

    useEffect(() => {
        if (session?.data?.user?.name && publicKey?.toBase58() !== session?.data?.user?.name) {
            logout();
        }
        if (publicKey === null) {
        } else if (connected && !session?.data?.user?.name) {
            // login();
        }
    }, [publicKey]);

    async function logout() {
        (await signOut()) && (await disconnect());
    }

    async function login() {
        const nonce = await fetchNonce();

        const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
        const encodedMessage = new TextEncoder().encode(message);

        // `publicKey` will be null if the wallet isn't connected
        if (!publicKey) throw new Error('Wallet not connected!');
        // `signMessage` will be undefined if the wallet doesn't support it
        if (!signMessage) throw new Error('Wallet does not support message signing!');

        const signature = await signMessage(encodedMessage);
        if (!sign.detached.verify(encodedMessage, signature, publicKey.toBytes()))
            throw new Error('Invalid signature!');

        signIn('credentials', {
            publicKey: publicKey,
            signature: bs58.encode(signature),
            callbackUrl: `${window.location}`
        });
    }

    async function fetchNonce() {
        const response = await fetch('/api/login');

        if (response.status != 200) throw new Error('nonce could not be retrieved');

        const { nonce } = await response.json();

        return nonce;
    }

    return (
        <>
            <div className="flex h-screen">
                <div className="m-auto p-4 bg-gray-200 shadow-md rounded-md w-96 overflow-clip">
                    {!session.data && !publicKey && (
                        <>
                            <p className="mb-6"> Sign in with Solana Wallet</p>
                            <WalletMultiButton> Login </WalletMultiButton>
                        </>
                    )}

                    {!session.data && publicKey && (
                        <>
                            <p className="mb-6"> Sign into platform</p>
                            <button
                                className="bg-white p-3 text-black rounded-lg border"
                                onClick={login}>
                                SIGN IN
                            </button>
                        </>
                    )}

                    {connected && publicKey && session.data && (
                        <>
                            <p className="mb-6">
                                <>
                                    Welcome {session?.data?.user?.name} <br /> Fully connected as{' '}
                                    {role}
                                    <br />
                                </>
                            </p>

                            <button
                                className="bg-black p-3  text-white rounded-lg border"
                                onClick={logout}>
                                SIGN OUT
                            </button>

                            {role === 'ADMIN' && (
                                <>
                                    <div className="mt-4"> Admin content... </div>
                                </>
                            )}
                            {role !== 'ADMIN' && <p> You are not an admin </p>}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
