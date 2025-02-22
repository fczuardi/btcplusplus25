import React from 'react';
import NDK from '@nostr-dev-kit/ndk';
import { KeyIcon } from 'lucide-react';

interface NostrLoginProps {
  onLogin: (pubkey: string) => void;
}

export function NostrLogin({ onLogin }: NostrLoginProps) {
  const handleLogin = async () => {
    try {
      // Initialize NDK
      const ndk = new NDK({
        explicitRelayUrls: [
          'wss://relay.damus.io',
          'wss://relay.nostr.band'
        ]
      });
      await ndk.connect();

      // Request user's public key using NIP-07
      if (!window.nostr) {
        alert('Please install a Nostr extension (like Alby or nos2x) to login');
        return;
      }

      const pubkey = await window.nostr.getPublicKey();
      onLogin(pubkey);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to login with Nostr. Please try again.');
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2"
    >
      <KeyIcon size={20} />
      Login with Nostr
    </button>
  );
}