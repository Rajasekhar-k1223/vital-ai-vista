// Authentication utilities and types for VitalAI platform

export type UserRole = "super_admin" | "org_admin" | "practitioner" | "patient"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string
  organizationName?: string
  avatar?: string
  isActive: boolean
  lastLogin?: Date
}

export interface Organization {
  id: string
  name: string
  type: string
  address: string
  phone: string
  email: string
  isActive: boolean
  adminCount: number
  patientCount: number
  practitionerCount: number
}

// Mock authentication state
export const mockUser: User = {
  id: "1",
  email: "admin@vitalai.com",
  name: "Dr. Sarah Johnson",
  role: "super_admin",
  organizationId: "org-1",
  organizationName: "VitalAI Medical Center",
  avatar: "",
  isActive: true,
  lastLogin: new Date()
}

// Mock organizations data
export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "VitalAI Medical Center",
    type: "Hospital",
    address: "123 Healthcare Blvd, Medical City, MC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@vitalaimedical.com",
    isActive: true,
    adminCount: 3,
    patientCount: 1250,
    practitionerCount: 45
  },
  {
    id: "org-2",
    name: "Community Health Clinic",
    type: "Clinic",
    address: "456 Community St, Health Town, HT 67890",
    phone: "+1 (555) 987-6543",
    email: "info@communityhc.com",
    isActive: true,
    adminCount: 2,
    patientCount: 850,
    practitionerCount: 12
  }
]

export const getUserDisplayName = (user: User): string => {
  return user.name || user.email
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    super_admin: "Super Administrator",
    org_admin: "Organization Administrator", 
    practitioner: "Healthcare Practitioner",
    patient: "Patient"
  }
  return roleMap[role]
}

export const canAccessRoute = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    patient: 1,
    practitioner: 2,
    org_admin: 3,
    super_admin: 4
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}