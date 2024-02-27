import { AdminPostProductsReq } from "@medusajs/medusa";
import type { SettingProps } from "@medusajs/admin";
import { Badge, Button } from "@medusajs/ui";
import { CheckMini } from "@medusajs/icons";
import { useAdminCreateProduct } from "medusa-react";
import { cleanUpProduct } from "./utils/helpers";

const CreateProduct = ({
  product,
  createdAll,
  notify,
}: {
  product: AdminPostProductsReq;
  createdAll: boolean;
  notify: SettingProps["notify"];
}) => {
  const { mutateAsync, isLoading, isSuccess } = useAdminCreateProduct();

  const handleCreateProduct = async (product: AdminPostProductsReq) => {
    const productPayload = cleanUpProduct(product);

    try {
      await mutateAsync(productPayload).then(() => {
        notify.success("Succes", "Product created");
      });
    } catch (error) {
      console.error("Product creation failed", error);
      notify.error(
        "Product creation failed.",
        "A product with the same handle might already exist."
      );
    }
  };

  return (
    <>
      {(isSuccess || createdAll) && (
        <Badge className="pr-4 self-end py-[5px]" color="green">
          <CheckMini />
          Created
        </Badge>
      )}
      {!(isSuccess || createdAll) && (
        <Button
          onClick={() => handleCreateProduct(product)}
          isLoading={isLoading}
          className="self-end"
          variant="secondary"
        >
          Create product
        </Button>
      )}
    </>
  );
};
export default CreateProduct;
