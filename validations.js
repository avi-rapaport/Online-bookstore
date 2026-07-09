export function validateAddToCart(body) {
  const errors = [];
  if (!body.customerId) {
    errors.push("customer ID required!");
  }
  if (!body.bookId) {
    errors.push("book ID required!");
  }
  if (!body.quantity || !Number.isInteger(body.quantity) || body.quantity < 0) {
    errors.push("quantity required and must be an integer and above 0!");
  }

  return { isValid: errors.length === 0, errors };
}
