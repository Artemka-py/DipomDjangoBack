// Логика применения формата даты
export const formatForDate = (dateString) => {
  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  return dateString.replace(pattern, '$3-$2-$1');
};
