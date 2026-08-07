/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProgress, Settings, CareerId } from './types';
import { loadUserProgress, saveUserProgress, loadSettings, saveSettings } from './utils/storage';

import { CRTOverlay } from './components/CRTOverlay';
import { NavbarHeader } from './components/NavbarHeader';
import { IntroSequence } from './components/IntroSequence';
import { WelcomeModal } from './components/WelcomeModal';
import { GateA_Quiz } from './components/GateA_Quiz';
import { GateB_CityMap } from './components/GateB_CityMap';
import { InternshipWorkspace } from './components/InternshipWorkspace';
import { CertificateView } from './components/CertificateView';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { VietnamMajorsModal } from './components/VietnamMajorsModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { DogMascotGuide } from './components/DogMascotGuide';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMajorsModalOpen, setIsMajorsModalOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);


  // Sync progress changes to localStorage
  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveUserProgress(updated);
  };

  // Sync settings changes to localStorage
  const handleUpdateSettings = (updated: Settings) => {
    setSettings(updated);
    saveSettings(updated);
  };

  // Reset all state to default
  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu thực tập?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Gate navigation handlers
  const handleStartQuizGate = (info: { name: string; school: string; className: string }) => {
    const updated = {
      ...progress,
      ...info,
      currentGate: 'quiz_gate' as const
    };
    handleUpdateProgress(updated);
  };

  const handleStartCityMapGate = (info: { name: string; school: string; className: string }) => {
    const updated = {
      ...progress,
      ...info,
      currentGate: 'city_map' as const
    };
    handleUpdateProgress(updated);
  };

  const handleSelectCareerFromMap = (careerId: CareerId) => {
    const updated = {
      ...progress,
      chosenCareer: careerId,
      currentGate: 'internship' as const
    };
    handleUpdateProgress(updated);
  };

  const handleFinishInternship = () => {
    const updated = {
      ...progress,
      currentGate: 'certificate' as const
    };
    handleUpdateProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#00ff41] font-mono selection:bg-[#00ff41] selection:text-[#0c0c0c] relative">
      {/* CRT Scanline Overlay Effect */}
      <CRTOverlay enabled={settings.crtScanlines} />

      {/* Main Top Header Navbar */}
      <NavbarHeader
        progress={progress}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onNavigateGate={(gate) => handleUpdateProgress({ ...progress, currentGate: gate })}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenMajorsModal={() => setIsMajorsModalOpen(true)}
        onOpenSaveLoadModal={() => setIsSaveLoadOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container Workspace */}
      <main className="p-3 sm:p-6 pb-20">
        {progress.currentGate === 'welcome' && (
          showIntro ? (
            <IntroSequence
              settings={settings}
              onComplete={() => setShowIntro(false)}
            />
          ) : (
            <WelcomeModal
              progress={progress}
              settings={settings}
              onStartQuizGate={handleStartQuizGate}
              onStartCityMapGate={handleStartCityMapGate}
            />
          )
        )}

        {progress.currentGate === 'quiz_gate' && (
          <GateA_Quiz
            progress={progress}
            settings={settings}
            onUpdateProgress={handleUpdateProgress}
            onSelectCareerToStart={handleSelectCareerFromMap}
            onGoToCityMap={() => handleUpdateProgress({ ...progress, currentGate: 'city_map' })}
          />
        )}

        {progress.currentGate === 'city_map' && (
          <GateB_CityMap
            progress={progress}
            settings={settings}
            onSelectCareer={handleSelectCareerFromMap}
          />
        )}

        {progress.currentGate === 'internship' && (
          <InternshipWorkspace
            progress={progress}
            settings={settings}
            onUpdateProgress={handleUpdateProgress}
            onFinishInternship={handleFinishInternship}
            onBackToMap={() => handleUpdateProgress({ ...progress, currentGate: 'city_map' })}
          />
        )}

        {progress.currentGate === 'certificate' && (
          <CertificateView
            progress={progress}
            settings={settings}
            onBackToMap={() => handleUpdateProgress({ ...progress, currentGate: 'city_map' })}
          />
        )}
      </main>

      {/* Teacher Dashboard Modal Overlay */}
      {isDashboardOpen && (
        <TeacherDashboardModal
          progress={progress}
          settings={settings}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}

      {/* 376 Vietnam Majors MOET Catalog Modal Overlay */}
      {isMajorsModalOpen && (
        <VietnamMajorsModal
          settings={settings}
          onClose={() => setIsMajorsModalOpen(false)}
          onSelectRoleplay={(careerId) => {
            setIsMajorsModalOpen(false);
            handleSelectCareerFromMap(careerId);
          }}
        />
      )}

      {/* Save / Load Slots Management Modal Overlay */}
      <SaveLoadModal
        progress={progress}
        settings={settings}
        isOpen={isSaveLoadOpen}
        onClose={() => setIsSaveLoadOpen(false)}
        onLoadProgress={(loadedProgress) => {
          setProgress(loadedProgress);
          saveUserProgress(loadedProgress);
        }}
      />

      {/* Floating Dog Mascot Guide Companion */}
      <DogMascotGuide
        progress={progress}
        settings={settings}
        onOpenSaveLoadModal={() => setIsSaveLoadOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenMajorsModal={() => setIsMajorsModalOpen(true)}
        onNavigateGate={(gate) => handleUpdateProgress({ ...progress, currentGate: gate })}
      />
    </div>
  );
}
