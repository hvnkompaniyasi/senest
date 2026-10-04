export function formatPrice(price: number, typeName?: string): string {
  const n = price.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
  if (typeName === "Ijara") return `${n} so'm/oy`;
  if (typeName === "Kunlik") return `${n} so'm/kun`;
  return `${n} y.e.`;
}
