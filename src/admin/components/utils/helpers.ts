import { AdminPostProductsReq } from "@medusajs/medusa";

const removeDecimal = (value: number) => {
  if (!value) return value;
  if (value.toString().includes(".")) {
    return Math.round(value * 100);
  }
};

const formatVariantPrices = (product: AdminPostProductsReq) => {
  // if the product has variants, and the variant has prices, and prices[i].amount exists, remove the decimal
  // if not, remove item from the price array
  if (product.variants) {
    product.variants.forEach((variant) => {
      console.log({ variant_before: variant });
      if (variant.prices) {
        variant.prices.forEach((price) => {
          if (price.amount) {
            price.amount = removeDecimal(price.amount);
          }
        });
        variant.prices = variant.prices.filter((price) => price.amount);
        console.log({ variant_after: variant });
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
