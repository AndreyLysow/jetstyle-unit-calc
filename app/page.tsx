'use client';

import { useState } from 'react';
import Hero from '../components/Hero';
import UnitCalc from '../components/unitcalc';
import EmailDownloadModal from '../components/EmailDownloadModal';
import CallbackModal from '../components/CallbackModal';
import UEInfo from '../components/UEInfo';

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

          {/* Новый блок — сразу после расчётов */}
          <UEInfo onConsult={() => setShowCallback(true)} />
        </div>

        {showEmail && (
          <EmailDownloadModal onClose={() => setShowEmail(false)} />
        )}
        {showCallback && (
          <CallbackModal onClose={() => setShowCallback(false)} />
        )}
      </main>
    </>
  );
}