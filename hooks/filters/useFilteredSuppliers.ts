import { Supplier } from "@/types/suppliers/supplierTypes";

// hooks/useFilteredSuppliers.ts
type Filters = {
  active?: boolean;
  categoryId?: number;
  productId?: number;
};

export const useFilteredSuppliers = ({
  allSuppliers,
  searchSupplier,
  debouncedQuery,
  filters,
  suppliersByProduct, // lista de Supplier resultante desde /supplier-products/by-product/:id
}: {
  allSuppliers: Supplier[];
  searchSupplier?: Supplier[];
  debouncedQuery: string;
  filters?: Filters;
  suppliersByProduct?: Supplier[]; // opcional; si se provee, se usa para filtrar por producto
}) => {
  // 1) Base: si hay búsqueda, usamos searchSupplier (si existe), si no usamos todos
  const base: Supplier[] =
    debouncedQuery && searchSupplier ? searchSupplier : allSuppliers;

  let result = base ?? [];

  // 2) Si hay filtro por producto y tenemos suppliersByProduct (traído del servidor),
  //    intersectamos (resultado ∩ suppliersByProduct)
  if (filters?.productId) {
    if (suppliersByProduct && suppliersByProduct.length > 0) {
      const ids = new Set(suppliersByProduct.map((s) => s.id));
      result = result.filter((s) => ids.has(s.id));
    } else {
      // Fallback: intentar filtrar en cliente mediante supplierProducts
      result = result.filter((s) =>
        s.supplierProducts?.some((sp) => sp.product?.id === filters.productId)
      );
    }
  }

  // 3) Filtros adicionales
  if (filters?.active !== undefined) {
    result = result.filter((s) => s.active === filters.active);
  }

  if (filters?.categoryId) {
    result = result.filter((s) =>
      s.supplierProducts?.some(
        (p) => p.product?.categoryId === filters.categoryId
      )
    );
  }

  return result;
};
