"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Mail, Building, Globe, Users, Bell, Shield, CreditCard, Save, Plus, Phone } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/4">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium">Admin User</h3>
                  <p className="text-sm text-muted-foreground">admin@penielbeachhotel.com</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <Separator />

              <nav className="flex flex-col space-y-1">
                <Button
                  variant={activeTab === "general" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("general")}
                >
                  <Building className="mr-2 h-4 w-4" />
                  General
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "users" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users & Permissions
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Settings
                </Button>
              </nav>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          {/* General Settings */}
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your hotel information and website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hotel Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hotel-name">Hotel Name</Label>
                      <Input id="hotel-name" defaultValue="Peniel Beach Hotel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotel-email">Email Address</Label>
                      <Input id="hotel-email" defaultValue="info@penielbeachhotel.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotel-phone">Phone Number</Label>
                      <Input id="hotel-phone" defaultValue="+256 772 485 887" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotel-alt-phone">Alternative Phone</Label>
                      <Input id="hotel-alt-phone" defaultValue="+256 752 703 147" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotel-address">Address</Label>
                    <Textarea
                      id="hotel-address"
                      defaultValue="Plot 110-120 Circular Road Bugonga, Opposite the old Airport, Entebbe, Uganda"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Website Settings</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Website Title</Label>
                      <Input id="site-title" defaultValue="Peniel Beach Hotel - Your Perfect Beach Getaway" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-tagline">Tagline</Label>
                      <Input id="site-tagline" defaultValue="Experience luxury and comfort at Peniel Beach Hotel" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-description">Meta Description</Label>
                    <Textarea
                      id="site-description"
                      defaultValue="Experience luxury and comfort at Peniel Beach Hotel, where unforgettable memories await. Book your stay today!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-keywords">Meta Keywords</Label>
                    <Input
                      id="site-keywords"
                      defaultValue="hotel, beach, Entebbe, Uganda, accommodation, luxury, vacation"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-mode" />
                    <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Links</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input id="facebook" defaultValue="https://facebook.com/penielbeachhotel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input id="instagram" defaultValue="https://instagram.com/penielbeachhotel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input id="twitter" defaultValue="https://twitter.com/penielbeachhotel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" defaultValue="" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your personal account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="Admin" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="User" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue="admin@penielbeachhotel.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+256 772 123 456" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label html="timezone">Timezone</Label>
                    <Select defaultValue="africa-kampala">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-kampala">Africa/Kampala (UTC+3)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (UTC+0/+1)</SelectItem>
                        <SelectItem value="america-new_york">America/New York (UTC-5/-4)</SelectItem>
                        <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Enable Dark Mode</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button>Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>

                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • Entebbe, Uganda</p>
                          <p className="text-xs text-muted-foreground mt-1">Started: March 21, 2025 at 10:30 AM</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Previous Session</h4>
                          <p className="text-sm text-muted-foreground">Safari on iPhone • Entebbe, Uganda</p>
                          <p className="text-xs text-muted-foreground mt-1">Last active: March 20, 2025 at 4:15 PM</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline">Log Out All Other Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">New Bookings</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new bookings are made
                        </p>
                      </div>
                      <Switch id="email-bookings" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Booking Cancellations</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when bookings are cancelled
                        </p>
                      </div>
                      <Switch id="email-cancellations" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Guest Messages</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications for new guest messages</p>
                      </div>
                      <Switch id="email-messages" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Payment Confirmations</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications for payment confirmations</p>
                      </div>
                      <Switch id="email-payments" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">System Updates</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
                      </div>
                      <Switch id="email-updates" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Browser Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Enable Browser Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch id="browser-notifications" defaultChecked />
                    </div>

                    <Button variant="outline">Test Browser Notification</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Schedule</h3>

                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users & Permissions */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Users & Permissions</CardTitle>
                <CardDescription>Manage user accounts and access permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">User Accounts</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>

                <div className="border rounded-md">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin User" />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Admin User</h4>
                        <p className="text-sm text-muted-foreground">admin@penielbeachhotel.com</p>
                      </div>
                    </div>
                    <Badge>Administrator</Badge>
                  </div>

                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Manager" />
                        <AvatarFallback>JM</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">John Manager</h4>
                        <p className="text-sm text-muted-foreground">manager@penielbeachhotel.com</p>
                      </div>
                    </div>
                    <Badge variant="outline">Manager</Badge>
                  </div>

                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Receptionist" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Sarah Receptionist</h4>
                        <p className="text-sm text-muted-foreground">reception@penielbeachhotel.com</p>
                      </div>
                    </div>
                    <Badge variant="outline">Receptionist</Badge>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael Content" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Michael Content</h4>
                        <p className="text-sm text-muted-foreground">content@penielbeachhotel.com</p>
                      </div>
                    </div>
                    <Badge variant="outline">Content Editor</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Permissions</h3>

                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Administrator</h4>
                          <p className="text-sm text-muted-foreground">Full access to all features and settings</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Role
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Bookings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>View Reports</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Payments</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Manager</h4>
                          <p className="text-sm text-muted-foreground">
                            Access to most features except user management
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Role
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          <span>Manage Users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Bookings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>View Reports</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Manage Payments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and processing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Credit Card Payments</h4>
                          <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, and American Express</p>
                        </div>
                      </div>
                      <Switch id="credit-card" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">PayPal</h4>
                          <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                        </div>
                      </div>
                      <Switch id="paypal" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Bank Transfer</h4>
                          <p className="text-sm text-muted-foreground">Accept payments via bank transfer</p>
                        </div>
                      </div>
                      <Switch id="bank-transfer" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Mobile Money</h4>
                          <p className="text-sm text-muted-foreground">Accept payments via mobile money services</p>
                        </div>
                      </div>
                      <Switch id="mobile-money" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Processor</h3>

                  <div className="space-y-2">
                    <Label htmlFor="payment-processor">Primary Payment Processor</Label>
                    <Select defaultValue="stripe">
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment processor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                        <SelectItem value="pesapal">Pesapal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" value="sk_test_••••••••••••••••••••••••" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input id="webhook-url" value="https://penielbeachhotel.com/api/webhooks/payments" readOnly />
                      <Button variant="outline">Copy</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Currency & Tax Settings</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="ugx">UGX - Ugandan Shilling</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" defaultValue="18" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="display-tax" defaultChecked />
                    <Label htmlFor="display-tax">Display tax separately on invoices</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

