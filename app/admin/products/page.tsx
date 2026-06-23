import { getAdminProducts } from '@/lib/actions/products'
import { ProductsTable } from '@/components/admin/products-table'

export const metadata = { title: 'ניהול מוצרים | מאפיית רונית' }

export default async function AdminProductsPage() {
  const products = await getAdminProducts()
  return <ProductsTable products={products} />
}
