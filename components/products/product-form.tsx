'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProduct, updateProduct } from '@/lib/actions/products'
import type { Product, ProductCategory } from '@/lib/types'

const CATEGORIES: ProductCategory[] = ['חלות', 'עוגות', 'ממתקים']

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'חלות')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('category', category)

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData)

    if (result.error) {
      toast.error('שגיאה: ' + result.error)
    } else {
      toast.success(product ? 'המוצר עודכן' : 'המוצר נוסף')
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">שם המוצר</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>קטגוריה</Label>
        <Select value={category} onValueChange={v => setCategory(v as ProductCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">מחיר (₪)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          dir="ltr"
          defaultValue={product?.price}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">תיאור</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ''}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">קישור לתמונה (URL)</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          dir="ltr"
          placeholder="https://..."
          defaultValue={product?.image_url ?? ''}
        />
      </div>
      {product && (
        <input type="hidden" name="available" value={String(product.available)} />
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'שומר...' : product ? 'עדכן מוצר' : 'הוסף מוצר'}
      </Button>
    </form>
  )
}
