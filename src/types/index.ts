export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  role: 'field_officer' | 'supervisor' | 'admin';
  assignedArea?: string;
  status: 'online' | 'offline' | 'on_duty';
}

export interface StaffAttendance {
  id: string;
  staffId: string;
  clockInTime: string;
  clockOutTime?: string;
  shiftType: 'morning' | 'general' | 'night';
  location?: {
    lat: number;
    lng: number;
  };
  date: string;
}

export interface ConveyanceRequest {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'denied';
  respondedAt?: string;
  respondedBy?: string;
  staffNotes?: string;
  estimatedDuration?: number; // in minutes
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface FieldReport {
  id: string;
  staffId: string;
  staffName: string;
  reportType: 'voice_note' | 'video' | 'incident';
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: 'audio' | 'video';
  siteId?: string;
  siteName?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  tags?: string[];
}
