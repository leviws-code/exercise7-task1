'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductForm } from '@/components/products/product-form'
import { deleteProduct, toggleProductAvailability } from '@/lib/actions/products'
import type { Product } from '@/lib/types'

export function ProductsTable({ products }: { products: Product[] }) {
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`למחוק את "${name}"?`)) return
    const result = await deleteProduct(id)
    if (result.error) toast.error('שגיאה במחיקה')
    else toast.success('המוצר נמחק')
  }

  async function handleToggle(id: string, available: boolean) {
    const result = await toggleProductAvailability(id, available)
    if (result.error) toast.error('שגיאה בעדכון')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">ניהול מוצרים</h2>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 me-1" />
          הוסף מוצר חדש
        </Button>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוספת מוצר חדש</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={open => !open && setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>עריכת מוצר</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              product={editProduct}
              onSuccess={() => setEditProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">תמונה</TableHead>
              <TableHead>שם</TableHead>
              <TableHead>קטגוריה</TableHead>
              <TableHead>מחיר</TableHead>
              <TableHead>זמין</TableHead>
              <TableHead className="text-end">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  אין מוצרים עדיין
                </TableCell>
              </TableRow>
            )}
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                    <Image
                      src={product.image_url ?? '/placeholder-product.svg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>₪{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Switch
                    checked={product.available}
                    onCheckedChange={v => handleToggle(product.id, v)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
