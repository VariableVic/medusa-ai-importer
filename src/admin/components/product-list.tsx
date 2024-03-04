import type { SettingProps } from "@medusajs/admin";
import { AdminPostProductsReq } from "@medusajs/medusa";
import { Table } from "@medusajs/ui";
import { motion } from "framer-motion";
import { useState } from "react";

import CreateAllProducts from "./create-all-products";
import CreateProduct from "./create-product";

type ProductListProps = {
  products: AdminPostProductsReq[];
  notify: SettingProps["notify"];
};

const ProductCard = ({ products, notify }: ProductListProps) => {
  const [createdAll, setCreatedAll] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01],
        out: { duration: 0.3, ease: [0.71, 0, 1.01, 0] },
      }}
    >
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Variants</Table.HeaderCell>
            <Table.HeaderCell>
              {products && (
                <CreateAllProducts
                  products={products}
                  createdAll={createdAll}
                  setCreatedAll={setCreatedAll}
                  notify={notify}
                />
              )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products &&
            products.map((p, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell>
                    <img
                      src={
                        p.thumbnail ||
                        p.images?.[0] ||
                        `http://localhost:9000/uploads/No-Image-Placeholder.png`
                      }
                      alt={p.title}
                      className="p-1 w-12 h-12 object-cover rounded-md "
                    />
                  </Table.Cell>
                  <Table.Cell>{p.title}</Table.Cell>
                  <Table.Cell>{p.description}</Table.Cell>
                  <Table.Cell>{p.variants.length}</Table.Cell>
                  <Table.Cell className="w-48 justify-end">
                    <CreateProduct
                      product={p}
                      createdAll={createdAll}
                      notify={notify}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </motion.div>
  );
};

export default ProductCard;
