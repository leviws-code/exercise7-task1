import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata = { title: 'הרשמה | מאפיית רונית' }

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="text-2xl">🥐</p>
          <CardTitle className="text-xl">מאפיית רונית</CardTitle>
          <p className="text-sm text-muted-foreground">יצירת חשבון חדש</p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}
