import { AdminPostProductsReq } from "@medusajs/medusa";

const removeDecimal = (value: number) => {
  if (!value || typeof value !== "number") return;

  if (value.toString().includes(".")) {
    return Math.round(value * 100);
  }
};

const formatVariantPrices = (product: AdminPostProductsReq) => {
  if (product.variants) {
    product.variants.forEach((variant) => {
      if (variant.prices) {
        variant.prices.forEach((price) => {
          if (price.amount) {
            price.amount = removeDecimal(price.amount);
          }
        });
        variant.prices = variant.prices.filter((price) => price.amount);
      }
    });
  }
  return product;
};

const cleanupEmptyStringsFromObject = (
  obj: AdminPostProductsReq
): AdminPostProductsReq => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      cleanupEmptyStringsFromObject(obj[key]);
    } else if (obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
};

export const cleanUpProduct = (product: AdminPostProductsReq) => {
  formatVariantPrices(product);
  cleanupEmptyStringsFromObject(product);
  return product;
};

export const cleanUpProducts = (products: AdminPostProductsReq[]) => {
  return products.map((p) => cleanUpProduct(p));
};
