export type TabType = 
  | 'home'
  | 'safe-route'
  | 'map'
  | 'reports'
  | 'contacts'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'sos';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  bloodGroup: string;
  medicalNotes: string;
  secretVoiceCommand: string;
  isLoggedIn: boolean;
  liveSharingEnabled: boolean;
  batteryLevel: number;
  safetyScore: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  notifySMS: boolean;
  notifyCall: boolean;
  avatarColor: string;
}

export interface UnsafeAreaReport {
  id: string;
  title: string;
  category: 'poor_lighting' | 'harassment' | 'suspicious' | 'deserted' | 'crime_history' | 'other';
  description: string;
  lat: number;
  lng: number;
  address: string;
  photoUrl?: string;
  severity: 'low' | 'medium' | 'high';
  reportedAt: string;
  reportedBy: string;
  upvotes: number;
  verifiedByAI: boolean;
  aiSafetyTip?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distance: string;
  duration: string;
  safetyScore: number;
  litPercentage: number;
  crimeRating: string;
  activeHazardsCount: number;
  policeStationsNearby: number;
  pathCoordinates: [number, number][];
  stepInstructions: string[];
  aiRecommendationSummary: string;
  recommended: boolean;
  originCoords?: [number, number];
  destinationCoords?: [number, number];
}

export interface EmergencyService {
  id: string;
  type: 'police' | 'hospital' | 'shelter' | 'fire';
  name: string;
  address: string;
  distance: string;
  phone: string;
  lat: number;
  lng: number;
  open247: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'emergency' | 'route_update' | 'safety_warning' | 'community_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity?: 'normal' | 'high' | 'critical';
}

export interface ActiveTripState {
  isTraveling: boolean;
  originName: string;
  destinationName: string;
  currentRoute: RouteOption | null;
  startedAt: string;
  estimatedArrival: string;
  liveSharingActive: boolean;
  progressPercent: number;
  currentLat: number;
  currentLng: number;
}

export interface RiskAssessmentData {
  overallScore: number;
  safetyStatus: 'safe' | 'caution' | 'warning' | 'danger';
  riskFactors: string[];
  recommendations: string[];
  activeAlertsCount: number;
}
