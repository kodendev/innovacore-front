import { Supplier } from "@/types/suppliers/supplierTypes";

export const useFilteredSuppliers = ({
  allSuppliers,
  searchSupplier,
  debouncedQuery,
  filters,
}: {
  allSuppliers: Supplier[];
  searchSupplier?: Supplier[];
  debouncedQuery: string;
  filters?: { active?: boolean; categoryId?: number };
}) => {
  if (debouncedQuery && searchSupplier) return searchSupplier;

  let result = allSuppliers;

  if (filters?.active !== undefined) {
    result = result.filter((s) => s.active === filters.active);
  }

  if (filters?.categoryId) {
    result = result.filter((s) =>
      s.supplierProducts.some(
        (p) => p.product.categoryId === filters.categoryId
      )
    );
  }

  return result;
};
