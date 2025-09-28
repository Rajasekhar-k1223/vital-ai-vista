import { useState } from 'react'
import { Plus, Search, Building, MapPin, Phone, Mail, Users, Settings, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/AuthContext'
import { mockOrganizations } from '@/lib/auth'

export function OrganizationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [organizations] = useState(mockOrganizations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({
    name: '',
    type: '',
    address: '',
    phone: '',
    email: ''
  })

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddOrganization = () => {
    console.log('Adding organization:', newOrg)
    setIsAddDialogOpen(false)
    setNewOrg({ name: '', type: '', address: '', phone: '', email: '' })
  }

  if (user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="medical-card text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">Only Super Administrators can access organization management.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            Organization Management
          </h1>
          <p className="text-muted-foreground">Manage healthcare organizations and their configurations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="medical-button">
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>Create a new healthcare organization in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={newOrg.name}
                    onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                    placeholder="Medical Center Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-type">Type</Label>
                  <Select value={newOrg.type} onValueChange={(value) => setNewOrg({...newOrg, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="practice">Private Practice</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-address">Address</Label>
                <Input
                  id="org-address"
                  value={newOrg.address}
                  onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-phone">Phone</Label>
                  <Input
                    id="org-phone"
                    value={newOrg.phone}
                    onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Email</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={newOrg.email}
                    onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                    placeholder="contact@organization.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrganization} className="medical-button">
                  Create Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
              <Building className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Organizations</p>
                <p className="text-2xl font-bold">{organizations.filter(o => o.isActive).length}</p>
              </div>
              <Badge className="status-active">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{organizations.reduce((sum, org) => sum + org.patientCount, 0).toLocaleString()}</p>
              </div>
              <Users className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Practitioners</p>
                <p className="text-2xl font-bold">{organizations.reduce((sum, org) => sum + org.practitionerCount, 0)}</p>
              </div>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Organizations Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage all healthcare organizations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statistics</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {org.address.split(',')[0]}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{org.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {org.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {org.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>{org.patientCount} Patients</div>
                      <div>{org.practitionerCount} Practitioners</div>
                      <div>{org.adminCount} Admins</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={org.isActive ? "status-active" : "status-inactive"}>
                      {org.isActive ? "Active" : "Inactive"}
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
                        <Settings className="h-4 w-4" />
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