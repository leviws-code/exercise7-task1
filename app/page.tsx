import { SiteHeader } from '@/components/layout/site-header'
import { ProductGrid } from '@/components/products/product-grid'
import { getProducts } from '@/lib/actions/products'

export const metadata = { title: 'מאפיית רונית — הזמנה אונליין' }

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">ברוכים הבאים למאפיית רונית</h1>
          <p className="text-muted-foreground">מוצרים טריים מוכנים מדי בוקר — הזמן/י עוד היום</p>
        </div>
        <ProductGrid products={products} />
      </main>
    </div>
  )
}
