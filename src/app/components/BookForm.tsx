'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

type Publisher = {
  id: number;
  name: string;
};

type BookFormProps = {
  publishers: Publisher[];
  book?: {
    id?: number;
    code: string;
    category: string;
    name: string;
    price: number;
    stock: number;
    publisherId: number;
  };
  action: (formData: FormData) => Promise<void>;
};

const bookSchema = z.object({
  code: z.string().min(1, "Book code is required").regex(/^[a-zA-Z0-9-]+$/, "Code must contain only letters, numbers, and hyphens"),
  category: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Book name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
  publisherId: z.coerce.number().positive("Publisher is required")
});

export default function BookForm({ publishers, book, action }: BookFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const formValues = {
      code: formData.get('code') as string,
      category: formData.get('category') as string,
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      stock: formData.get('stock') as string,
      publisherId: formData.get('publisherId') as string
    };

    try {
      bookSchema.parse(formValues);
      
      try {
        await action(formData);
      } catch (error: any) {
        console.error('Submission error:', error);
        setErrors({ form: error.message || 'An error occurred while saving the book' });
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: 'An unexpected error occurred' });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {book?.id && <input type="hidden" name="id" value={book.id} />}
      
      <div>
        <label className="block mb-1">Code:</label>
        <input 
          name="code" 
          type="text" 
          defaultValue={book?.code || ''}
          className={`w-full border ${errors.code ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Category:</label>
        <input 
          name="category" 
          type="text" 
          defaultValue={book?.category || ''}
          className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Name:</label>
        <input 
          name="name" 
          type="text" 
          defaultValue={book?.name || ''}
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Price:</label>
        <input 
          name="price" 
          type="number" 
          step="0.01"
          min="0" 
          defaultValue={book?.price || ''}
          className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Stock:</label>
        <input 
          name="stock" 
          type="number" 
          min="0"
          step="1"
          defaultValue={book?.stock || ''}
          className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Publisher:</label>
        <select 
          name="publisherId" 
          defaultValue={book?.publisherId || ''}
          className={`w-full border ${errors.publisherId ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
        >
          <option value="">--Select Publisher--</option>
          {publishers.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
        {errors.publisherId && <p className="text-red-500 text-sm mt-1">{errors.publisherId}</p>}
      </div>
      
      {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
      
      <div className="flex space-x-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : book?.id ? 'Update' : 'Create'}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()}
          className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}