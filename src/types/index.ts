import React from "react";

export interface Product {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  price: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
}

export interface Pricing {
  id?: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  price: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  image?: string;
}

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}
