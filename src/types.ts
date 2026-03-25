/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  brand: string;
  featured?: boolean;
  videoUrl?: string;
  platform?: string;
  version?: string;
  requirements?: string;
  androidVersion?: string;
  ramRequired?: string;
  fileSize?: string;
  downloadUrl?: string;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  isAdmin?: boolean;
  gallery?: string[];
  birthDate?: string;
  biNumber?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  state?: string;
  apartment?: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  paymentMethod?: string;
  proofName?: string;
}
