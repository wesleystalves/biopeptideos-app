import { redirect } from 'next/navigation';

// /auth → /auth/login (redirecionamento permanente)
export default function AuthPage() {
    redirect('/auth/login');
}
