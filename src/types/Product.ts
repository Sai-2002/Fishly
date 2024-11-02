import { ReactNode } from "react";

// types/Product.ts
export interface Product {
    [x: string]: ReactNode;
    _id: string; // Ensure the type matches your product structure
    name: string;
    price: number;
    image: string;
    weight: string;
    pieces: string;
    servings: string;
    description: string;
    macros: string;
  }
  