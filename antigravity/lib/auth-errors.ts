export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getAuthErrorMessage(error: { message: string; status?: number }, context: 'login' | 'signup'): string {
  const msg = error.message.toLowerCase()

  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already registered')) {
    return 'This email is already registered. Sign in with the same password you used when signing up, or reset the password in Supabase → Authentication → Users.'
  }

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    if (context === 'login') {
      return 'Invalid email or password. Common causes: (1) password does not match what you used at signup, (2) email not confirmed yet. In Supabase → Authentication → Users → open your user → confirm email or reset password.'
    }
    return 'Invalid credentials.'
  }

  if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
    return 'Email not confirmed. In Supabase → Authentication → Users → select your user and confirm the email, or run CONFIRM-USERS.sql in SQL Editor.'
  }

  if (msg.includes('rate limit')) {
    return 'Too many attempts. Wait a few minutes or confirm users in Supabase dashboard.'
  }

  return error.message
}
