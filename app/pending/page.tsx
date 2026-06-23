import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = { title: 'ממתין לאישור | מאפיית רונית' }

export default function PendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <p className="text-4xl">⏳</p>
          <CardTitle className="text-xl">ממתין לאישור</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            הבקשה שלך התקבלה ומחכה לאישור מנהל המערכת.
            <br />
            תקבל/י גישה לאחר שהבקשה תאושר.
          </p>
          <p className="text-muted-foreground text-sm">
            לשאלות פנה/י ל-{' '}
            <a href="mailto:leviws@gmail.com" className="text-primary underline">
              leviws@gmail.com
            </a>
          </p>
          <Button variant="outline" render={<Link href="/" />}>חזרה לדף הבית</Button>
        </CardContent>
      </Card>
    </main>
  )
}
