'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateUserStatus } from '@/lib/actions/auth'
import type { Profile, UserRole, UserStatus } from '@/lib/types'

const roleLabels: Record<UserRole, string> = {
  admin: 'אדמין',
  manager: 'מנהל חנות',
  customer: 'לקוח',
}

const statusBadge: Record<UserStatus, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive' }> = {
  pending:  { label: 'ממתין',  variant: 'outline' },
  approved: { label: 'מאושר', variant: 'default' },
  rejected: { label: 'נדחה',  variant: 'destructive' },
}

export function UsersTable({ users }: { users: Profile[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleStatusChange(userId: string, value: string) {
    const [status, role] = value.split(':') as [UserStatus, UserRole | undefined]
    setLoadingId(userId)
    const result = await updateUserStatus(userId, status, role)
    if (result.error) toast.error('שגיאה בעדכון')
    else { toast.success('המשתמש עודכן'); router.refresh() }
    setLoadingId(null)
  }

  const statusRoleOptions: Array<{ value: string; label: string }> = [
    { value: 'approved:customer', label: 'אישור — לקוח' },
    { value: 'approved:manager', label: 'אישור — מנהל חנות' },
    { value: 'approved:admin',   label: 'אישור — אדמין' },
    { value: 'pending:',         label: 'השהייה (pending)' },
    { value: 'rejected:',        label: 'דחייה' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">ניהול משתמשים</h2>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>אימייל</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>תפקיד</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>נרשם</TableHead>
              <TableHead>פעולה</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  אין משתמשים
                </TableCell>
              </TableRow>
            )}
            {users.map(user => {
              const sb = statusBadge[user.status]
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell dir="ltr" className="text-sm">{user.email}</TableCell>
                  <TableCell dir="ltr" className="text-sm">{user.phone ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{roleLabels[user.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: he })}
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={loadingId === user.id || user.role === 'admin'}
                      onValueChange={v => handleStatusChange(user.id, v as string)}
                    >
                      <SelectTrigger className="h-8 w-44 text-xs">
                        <SelectValue placeholder="שנה סטטוס/תפקיד" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusRoleOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
