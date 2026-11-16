export const getEffectivePrice = (product) => {
  return product.discountPrice ?? product.price;
};
