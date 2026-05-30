export const DEMO_CREDENTIALS = {
  manager: {
    email: 'sarah.manager@antigravity.demo',
    password: 'demo1234',
    name: 'Sarah Mitchell',
    role: 'manager' as const,
  },
  employee: {
    email: 'alice.chen@antigravity.demo',
    password: 'demo1234',
    name: 'Alice Chen',
    role: 'employee' as const,
  },
} as const
