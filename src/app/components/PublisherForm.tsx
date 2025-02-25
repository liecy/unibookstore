'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

type PublisherFormProps = {
  publisher?: {
    id?: number;
    code: string;
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  action: (formData: FormData) => Promise<void>;
};

const publisherSchema = z.object({
  code: z.string().min(1, "Publisher code is required").regex(/^[a-zA-Z0-9-]+$/, "Code must contain only letters, numbers, and hyphens"),
  name: z.string().min(2, "Publisher name must be at least 2 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
});

export default function PublisherForm({ publisher, action }: PublisherFormProps) {
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
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      phone: formData.get('phone') as string
    };

    try {
      publisherSchema.parse(formValues);
      
      try {
        await action(formData);
      } catch (error: any) {
        console.error('Submission error:', error);
        setErrors({ form: error.message || 'An error occurred while saving the publisher' });
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
      {publisher?.id && <input type="hidden" name="id" value={publisher.id} />}
      
      <div>
        <label className="block mb-1">Code:</label>
        <input 
          name="code" 
          type="text" 
          defaultValue={publisher?.code || ''}
          className={`w-full border ${errors.code ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Name:</label>
        <input 
          name="name" 
          type="text" 
          defaultValue={publisher?.name || ''}
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Address:</label>
        <input 
          name="address" 
          type="text" 
          defaultValue={publisher?.address || ''}
          className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>
      
      <div>
        <label className="block mb-1">City:</label>
        <input 
          name="city" 
          type="text" 
          defaultValue={publisher?.city || ''}
          className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Phone:</label>
        <input 
          name="phone" 
          type="text" 
          defaultValue={publisher?.phone || ''}
          className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`} 
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      
      {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
      
      <div className="flex space-x-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : publisher?.id ? 'Update Publisher' : 'Create Publisher'}
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