import { useState } from 'react'
import { Plus, Search, UserCog, Mail, Phone, Calendar, Eye, Edit, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/AuthContext'
import { UserRole, getRoleDisplayName } from '@/lib/auth'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId: string
  organizationName: string
  isActive: boolean
  lastLogin: Date
  phone?: string
  department?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@vitalai.com',
    role: 'super_admin',
    organizationId: 'org-1',
    organizationName: 'VitalAI Medical Center',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    phone: '+1 (555) 123-4567',
    department: 'Administration'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@vitalai.com',
    role: 'practitioner',
    organizationId: 'org-1',
    organizationName: 'VitalAI Medical Center',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    phone: '+1 (555) 234-5678',
    department: 'Cardiology'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@communityhc.com',
    role: 'org_admin',
    organizationId: 'org-2',
    organizationName: 'Community Health Clinic',
    isActive: true,
    lastLogin: new Date('2024-01-14T16:45:00'),
    phone: '+1 (555) 345-6789',
    department: 'Administration'
  },
  {
    id: '4',
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@vitalai.com',
    role: 'practitioner',
    organizationId: 'org-1',
    organizationName: 'VitalAI Medical Center',
    isActive: false,
    lastLogin: new Date('2024-01-10T14:20:00'),
    phone: '+1 (555) 456-7890',
    department: 'Emergency'
  }
]

export function UserManagementPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [users] = useState(mockUsers)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    phone: '',
    department: ''
  })

  // Filter users based on current user's role
  const getFilteredUsers = () => {
    let filteredUsers = users

    if (user?.role === 'org_admin') {
      // Org admins can only see users from their organization
      filteredUsers = users.filter(u => u.organizationId === user.organizationId)
    }

    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === roleFilter)
    }

    return filteredUsers
  }

  const handleAddUser = () => {
    console.log('Adding user:', newUser)
    setIsAddDialogOpen(false)
    setNewUser({ name: '', email: '', role: '' as UserRole, phone: '', department: '' })
  }

  if (!user || (user.role !== 'super_admin' && user.role !== 'org_admin')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="medical-card text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only Administrators can access user management.</p>
        </Card>
      </div>
    )
  }

  const availableRoles = user.role === 'super_admin' 
    ? ['super_admin', 'org_admin', 'practitioner', 'patient']
    : ['practitioner', 'patient']

  const filteredUsers = getFilteredUsers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            {user.role === 'super_admin' 
              ? 'Manage all system users and their roles'
              : `Manage users in ${user.organizationName}`
            }
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="medical-button">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john.doe@hospital.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {getRoleDisplayName(role as UserRole)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-phone">Phone</Label>
                  <Input
                    id="user-phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-department">Department</Label>
                <Input
                  id="user-department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  placeholder="Cardiology, Emergency, Administration..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} className="medical-button">
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{filteredUsers.length}</p>
              </div>
              <UserCog className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{filteredUsers.filter(u => u.isActive).length}</p>
              </div>
              <Badge className="status-active">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Practitioners</p>
                <p className="text-2xl font-bold">{filteredUsers.filter(u => u.role === 'practitioner').length}</p>
              </div>
              <Shield className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{filteredUsers.filter(u => u.role.includes('admin')).length}</p>
              </div>
              <UserCog className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Roles</SelectItem>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {getRoleDisplayName(role as UserRole)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCog className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleDisplayName(user.role)}</Badge>
                    {user.department && (
                      <p className="text-sm text-muted-foreground mt-1">{user.department}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{user.organizationName}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {user.lastLogin.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.isActive ? "status-active" : "status-inactive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}