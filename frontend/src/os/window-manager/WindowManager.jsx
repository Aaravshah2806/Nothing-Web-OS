import React from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY } from '../../apps/appRegistry';
import Window from './Window';

export default function WindowManager() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <>
      {windows.map((win) => {
        const app = APP_REGISTRY[win.appId];
        return <Window key={win.id} windowData={win} app={app} />;
      })}
    </>
  );
}
