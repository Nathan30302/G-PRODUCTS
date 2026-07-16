"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode
} from "react";
import { Product, ProductVariant } from "@/lib/types";

export type CartItem = {
  id: string; // productId:variantId or productId
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  variantName?: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = { items: CartItem[] };

type AddPayload = {
  product: Product;
  variant?: ProductVariant;
};

type CartAction =
  | { type: "add"; payload: AddPayload }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

const STORAGE_KEY = "gproducts_cart_v2";

function cartLineId(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const { product, variant } = action.payload;
      const id = cartLineId(product.id, variant?.id);
      const displayName = variant
        ? `${product.name} (${variant.name})`
        : product.name;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          )
        };
      }
      return {
        items: [
          ...state.items,
          {
            id,
            productId: product.id,
            variantId: variant?.id,
            slug: product.slug,
            name: displayName,
            variantName: variant?.name,
            price: product.price,
            image: product.images[0]?.url ?? "",
            qty: 1
          }
        ]
      };
    }
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0)
      };
    case "clear":
      return { items: [] };
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, variant?: ProductVariant) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.qty, 0);
    const total = state.items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      add: (product, variant) =>
        dispatch({ type: "add", payload: { product, variant } }),
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
