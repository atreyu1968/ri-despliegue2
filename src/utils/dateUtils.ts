export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isExpired = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES');
};