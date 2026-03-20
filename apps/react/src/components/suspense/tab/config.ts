export const tabs = [
  { id: 'account', name: 'My Account', href: '#', active: true },
  { id: 'company', name: 'Company', href: '#', active: false },
  { id: 'team', name: 'Team Members', href: '#', active: false },
  { id: 'billing', name: 'Billing', href: '#', active: false },
]

export type Tab = (typeof tabs)[number]
