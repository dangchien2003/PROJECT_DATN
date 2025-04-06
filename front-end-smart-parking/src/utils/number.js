export function formatCurrency(number) {
  if (number === 0) return "0";
  if (!number) return "";
  return number.toLocaleString("vi-VN");
}
export function parseFormattedCurrency(value) {
  // Chuyển về string
  if (typeof value !== "string") {
    value = String(value);
  }
  if (!value) return "";
  // Xoá tất cả ký tự trước dấu '-' đầu tiên nếu có, giữ dấu '-' ở đầu chuỗi
  value = value.replace(/^[^-]*-/, "-");
  // Xoá tất cả ký tự không phải số hoặc dấu '-'
  const numberString = value.replace(/[^0-9-]/g, "");
  // Trả về số nguyên hoặc giá trị chuỗi nếu không thể chuyển đổi
  return parseInt(numberString, 10) || numberString;
}
