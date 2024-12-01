export const mockRegistrationCodes = [
  {
    id: '1',
    code: 'REG2024001',
    role: 'manager',
    expirationDate: '2024-12-31',
    maxUses: 5,
    usedCount: 0,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    code: 'INNOVA2024',
    role: 'manager',
    expirationDate: '2024-12-31',
    maxUses: 10,
    usedCount: 0,
    isActive: true,
    createdAt: new Date().toISOString().split('T')[0],
  }
];