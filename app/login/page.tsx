import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'כניסה | מאפיית רונית' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="text-2xl">🥐</p>
          <CardTitle className="text-xl">מאפיית רונית</CardTitle>
          <p className="text-sm text-muted-foreground">כניסה לחשבון</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
