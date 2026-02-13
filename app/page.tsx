import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect root to login page
  redirect('/login')
}
