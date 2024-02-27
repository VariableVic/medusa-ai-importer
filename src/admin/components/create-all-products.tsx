import { AdminPostProductsReq } from "@medusajs/medusa";
import type { SettingProps } from "@medusajs/admin";
import { Badge, Button } from "@medusajs/ui";
import { CheckMini } from "@medusajs/icons";
import { useAdminCreateProduct } from "medusa-react";
import { cleanUpProducts } from "../util/helpers";

const CreateAllProducts = ({
  products,
  createdAll,
  setCreatedAll,
  notify,
}: {
  products: AdminPostProductsReq[];
  createdAll: boolean;
  setCreatedAll: (createdAll: boolean) => void;
  notify: SettingProps["notify"];
}) => {
  const { mutateAsync, isLoading } = useAdminCreateProduct();

  const handleCreateProducts = async (products: AdminPostProductsReq[]) => {
    const productsPayload = cleanUpProducts(products);

    const productPromises = productsPayload.map((product) => {
      return mutateAsync(product);
    });

    try {
      await Promise.all(productPromises).then(() => {
        setCreatedAll(true);
        notify.success("Succes", "Created all products");
      });
    } catch (error) {
      notify.error(
        "Product creation failed.",
        "A product with the same handle might already exist."
      );
    }
  };

  return (
    <>
      {createdAll && (
        <Badge className="pr-4 self-end py-[5px] w-max" color="green">
          <CheckMini />
          Created {products.length} products
        </Badge>
      )}
      {!createdAll && (
        <Button
          onClick={() => handleCreateProducts(products)}
          isLoading={isLoading}
          className="self-end w-max"
          variant="primary"
        >
          Create {products.length} products
        </Button>
      )}
    </>
  );
};
export default CreateAllProducts;
