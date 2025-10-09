"use client";
import Desktop from '@/components/os/desktop';
import { WindowManager } from '@/components/os/window/window-manager';

export default function Page() {
  return (
    <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <WindowManager>
        <Desktop />
      </WindowManager>
    </div>
  );
}
