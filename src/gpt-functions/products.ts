const stringType = {
  type: "string",
};

const objectType = {
  type: "object",
};

const numberType = {
  type: "number",
};

const booleanType = {
  type: "boolean",
};

const arrayType = {
  type: "array",
};

const variantObject = {
  ...objectType,
  properties: {
    title: {
      ...stringType,
      description: "Title of the variant.",
    },
    sku: {
      ...stringType,
      description: "SKU of the variant.",
    },
    ean: {
      ...stringType,
      description: "EAN of the variant.",
    },
    upc: {
      ...stringType,
      description: "UPC of the variant.",
    },
    barcode: {
      ...stringType,
      description: "Barcode of the variant.",
    },
    inventory_quantity: {
      ...numberType,
      description: "Inventory quantity of the variant.",
    },
    material: {
      ...stringType,
      description: "Material of the variant.",
    },
    prices: {
      ...arrayType,
      items: {
        ...objectType,
        properties: {
          amount: {
            ...numberType,
            description:
              "Integer value of the price. The value is in the smallest unit of the currency. For example, cents for USD. CAN NOT be a float.",
          },
          currency_code: {
            ...stringType,
            description: "ISO 4217 currency code of the price. Default is USD.",
          },
        },
        required: ["amount", "currency"],
      },
      description: "Array of prices for the variant.",
    },
  },
  required: ["title"],
};

const productObject = {
  ...objectType,
  properties: {
    title: {
      ...stringType,
      description: "Title of the product.",
    },
    subtitle: {
      ...stringType,
      description: "Subtitle of the product.",
    },
    description: {
      ...stringType,
      description: "Description of the product.",
    },
    is_giftcard: {
      ...booleanType,
      description: "Flag to indicate if the product is a gift card.",
    },
    discountable: {
      ...booleanType,
      description: "Flag to indicate if the product is discountable.",
    },
    images: {
      ...arrayType,
      items: {
        ...stringType,
      },
      description: "Array of image URLs for the product.",
    },
    thumbnail: {
      ...stringType,
      description: "Thumbnail URL for the product.",
    },
    handle: {
      ...stringType,
      description: "Handle for the product.",
    },
    status: {
      ...stringType,
      description: "Status of the product.",
    },
    weight: {
      ...numberType,
      description: "Weight of the product.",
    },
    length: {
      ...numberType,
      description: "Length of the product.",
    },
    height: {
      ...numberType,
      description: "Height of the product.",
    },
    width: {
      ...numberType,
      description: "Width of the product.",
    },
    hs_code: {
      ...stringType,
      description: "HS code of the product.",
    },
    origin_country: {
      ...stringType,
      description: "Origin country of the product.",
    },
    mid_code: {
      ...stringType,
      description: "Mid code of the product.",
    },
    material: {
      ...stringType,
      description: "Material of the product.",
    },
    metadata: {
      ...objectType,
      description: "Metadata of the product.",
    },
    variants: {
      ...arrayType,
      items: {
        ...variantObject,
      },
      description: "Array of variants for the product.",
    },
  },
  required: ["title", "is_giftcard", "discountable"],
};

export const productTools = [
  {
    type: "function",
    function: {
      name: "propose_products",
      description:
        "Propose an array of products to be added to the store. If no title is specified, ask the user to specify it. If no is_giftcard is specified, default to false. if no is_discountable is specified, default to true. If no status is specified, default to `draft`. Your output can only contain parameters specified in this function.",
      parameters: {
        ...objectType,
        properties: {
          products: {
            ...arrayType,
            items: {
              ...productObject,
            },
            description: "Array of products to be added to the store.",
          },
        },
        required: ["products"],
      },
    },
  },
];
