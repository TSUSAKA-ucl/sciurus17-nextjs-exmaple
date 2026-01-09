"use client";

import dynamic from 'next/dynamic';

// A-Frameを含むコンポーネントをSSRなしで読み込む
const SceneComponent = dynamic(() => import('./App.jsx'), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <SceneComponent />
    </div>
  );
}