'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import UnitCalc from '@/components/unitcalc';
import EmailDownloadModal from '@/components/EmailDownloadModal';
import CallbackModal from '@/components/CallbackModal';

export default function Page() {
  const [showEmail, setShowEmail] = useState(false);
  const [showCallback, setShowCallback] = useState(false);

  return (
    <>
      <Hero />
      <main>
        <div className="container">
          <div className="panel">
            <UnitCalc onDownload={() => setShowEmail(true)} />
          </div>

          <div style={{ height: 18 }} />
          <button className="btn btn--ghost" onClick={() => setShowCallback(true)}>
            Записаться на консультацию
          </button>
        </div>

        {showEmail ? <EmailDownloadModal onClose={() => setShowEmail(false)} /> : null}
        {showCallback ? <CallbackModal onClose={() => setShowCallback(false)} /> : null}
      </main>
    </>
  );
}