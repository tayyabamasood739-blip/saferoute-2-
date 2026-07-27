import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { SafeRoutePlanner } from './components/SafeRoutePlanner';
import { LiveMapView } from './components/LiveMapView';
import { ReportsFeed } from './components/ReportsFeed';
import { EmergencyContactsManager } from './components/EmergencyContactsManager';
import { NotificationsPanel } from './components/NotificationsPanel';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { SOSModal } from './components/SOSModal';
import { VoiceActivationListener } from './components/VoiceActivationListener';
import { ReportUnsafeModal } from './components/ReportUnsafeModal';
import { AuthScreen } from './components/AuthScreen';

import {
  initialUserProfile,
  initialEmergencyContacts,
  initialUnsafeAreaReports,
  getEmergencyServicesAround,
  initialNotifications,
} from './data/mockData';

import { TabType, UserProfile, EmergencyContact, UnsafeAreaReport, RouteOption, ActiveTripState, NotificationItem } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(initialUserProfile);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // GPS Coordinates (Defaults to San Francisco downtown, updates with real browser GPS)
  const [userLat, setUserLat] = useState<number>(37.7749);
  const [userLng, setUserLng] = useState<number>(-122.4194);

  // App States
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialEmergencyContacts);
  const [reports, setReports] = useState<UnsafeAreaReport[]>(initialUnsafeAreaReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalLat, setReportModalLat] = useState<number | undefined>(undefined);
  const [reportModalLng, setReportModalLng] = useState<number | undefined>(undefined);

  const [isVoiceListening, setIsVoiceListening] = useState(true);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);

  const [activeTrip, setActiveTrip] = useState<ActiveTripState>({
    isTraveling: false,
    originName: '',
    destinationName: '',
    currentRoute: null,
    startedAt: '',
    estimatedArrival: '',
    liveSharingActive: true,
    progressPercent: 0,
    currentLat: 37.7749,
    currentLng: -122.4194,
  });

  // Fetch real browser GPS location if permitted
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation fallback to default coords:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const emergencyServices = getEmergencyServicesAround(userLat, userLng);

  // Unread notifications count
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Contact Actions
  const handleAddContact = (contact: EmergencyContact) => {
    setContacts((prev) => [...prev, contact]);
  };

  const handleRemoveContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetPrimaryContact = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  // Report Actions
  const handleAddReport = (newReport: UnsafeAreaReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleUpvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Trip Start / Stop
  const handleStartTrip = (route: RouteOption, origin: string, destination: string) => {
    setActiveRoute(route);
    setActiveTrip({
      isTraveling: true,
      originName: origin,
      destinationName: destination,
      currentRoute: route,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedArrival: route.duration,
      liveSharingActive: true,
      progressPercent: 10,
      currentLat: userLat,
      currentLng: userLng,
    });
    setActiveTab('map');
  };

  const handleEndTrip = () => {
    setActiveTrip((prev) => ({ ...prev, isTraveling: false }));
    setActiveRoute(null);
  };

  // Open Report Modal at specific coords
  const handleOpenReportAtCoords = (lat?: number, lng?: number) => {
    setReportModalLat(lat);
    setReportModalLng(lng);
    setIsReportModalOpen(true);
  };

  if (!user || !user.isLoggedIn) {
    return <AuthScreen onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Voice Activation Listener */}
      <VoiceActivationListener
        secretCommand={user.secretVoiceCommand}
        onTriggerSOS={() => setIsSOSOpen(true)}
        isListening={isVoiceListening}
        setIsListening={setIsVoiceListening}
      />

      {/* Top Header */}
      <Header
        user={user}
        unreadCount={unreadNotificationsCount}
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        isVoiceListening={isVoiceListening}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {activeTab === 'home' && (
          <HomeDashboard
            user={user}
            userLat={userLat}
            userLng={userLng}
            activeTrip={activeTrip}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenReportModal={() => handleOpenReportAtCoords()}
          />
        )}

        {activeTab === 'safe-route' && (
          <SafeRoutePlanner
            userLat={userLat}
            userLng={userLng}
            onSelectRouteForMap={(route) => setActiveRoute(route)}
            onStartTrip={handleStartTrip}
            activeTrip={activeTrip}
            onEndTrip={handleEndTrip}
          />
        )}

        {activeTab === 'map' && (
          <LiveMapView
            userLat={userLat}
            userLng={userLng}
            emergencyServices={emergencyServices}
            unsafeReports={reports}
            activeRoute={activeRoute}
            onOpenReportModal={(lat, lng) => handleOpenReportAtCoords(lat, lng)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsFeed
            reports={reports}
            onUpvoteReport={handleUpvoteReport}
            onOpenReportModal={() => handleOpenReportAtCoords()}
            onViewOnMap={(report) => {
              setUserLat(report.lat);
              setUserLng(report.lng);
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContactsManager
            contacts={contacts}
            onAddContact={handleAddContact}
            onRemoveContact={handleRemoveContact}
            onSetPrimary={handleSetPrimaryContact}
            onSendTestAlert={() => {
              const newNotif: NotificationItem = {
                id: `notif-${Date.now()}`,
                type: 'emergency',
                title: 'Test SOS Alert Sent',
                message: 'Test SMS and live GPS broadcast dispatched to ' + contacts.find((c) => c.isPrimary)?.name,
                timestamp: 'Just now',
                read: false,
                severity: 'high',
              };
              setNotifications((prev) => [newNotif, ...prev]);
            }}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsPanel
            notifications={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            onClearNotifications={() => setNotifications([])}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            user={user}
            onUpdateProfile={(updated) => setUser((prev) => (prev ? { ...prev, ...updated } : null))}
            onLogout={() => setUser(null)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            user={user}
            onUpdateUser={(updated) => setUser((prev) => (prev ? { ...prev, ...updated } : null))}
            isVoiceListening={isVoiceListening}
            setIsVoiceListening={setIsVoiceListening}
          />
        )}
      </main>

      {/* SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        user={user}
        contacts={contacts}
        userLat={userLat}
        userLng={userLng}
      />

      {/* Report Unsafe Modal */}
      <ReportUnsafeModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userLat={userLat}
        userLng={userLng}
        initialLat={reportModalLat}
        initialLng={reportModalLng}
        onAddReport={handleAddReport}
      />

      {/* Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

    </div>
  );
}
