import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Staff, StaffAttendance } from '@/types';

// API Configuration - points to the guardwise-platform server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface AuthContextType {
  staff: Staff | null;
  attendance: StaffAttendance | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAttendance: (attendance: StaffAttendance | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [attendance, setAttendance] = useState<StaffAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedStaff = localStorage.getItem('guardwise_staff');
    const savedAttendance = localStorage.getItem('guardwise_staff_attendance');
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the platform server API for staff login
      const response = await fetch(`${API_BASE_URL}/staff/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.error);
        return false;
      }

      if (data.success && data.staff) {
        const staffData: Staff = {
          id: data.staff.id,
          name: data.staff.name,
          email: data.staff.email,
          phone: data.staff.phone,
          employeeId: data.staff.employeeId,
          role: data.staff.role,
          assignedArea: data.staff.assignedArea,
          status: 'online',
        };
        setStaff(staffData);
        localStorage.setItem('guardwise_staff', JSON.stringify(staffData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setStaff(null);
    setAttendance(null);
    localStorage.removeItem('guardwise_staff');
    localStorage.removeItem('guardwise_staff_attendance');
  };

  const updateAttendance = (newAttendance: StaffAttendance | null) => {
    setAttendance(newAttendance);
    if (newAttendance) {
      localStorage.setItem('guardwise_staff_attendance', JSON.stringify(newAttendance));
    } else {
      localStorage.removeItem('guardwise_staff_attendance');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        staff,
        attendance,
        isLoading,
        login,
        logout,
        setAttendance: updateAttendance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
