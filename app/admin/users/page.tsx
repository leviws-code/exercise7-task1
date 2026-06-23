import { getAllUsers } from '@/lib/actions/auth'
import { UsersTable } from '@/components/admin/users-table'

export const metadata = { title: 'ניהול משתמשים | מאפיית רונית' }

export default async function AdminUsersPage() {
  const users = await getAllUsers()
  return <UsersTable users={users} />
}
