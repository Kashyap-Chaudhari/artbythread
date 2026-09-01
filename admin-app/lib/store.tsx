"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus, Product, CustomRequest } from "./types";
import { isSupabaseConfigured, supabase } from "./supabase";

interface AdminStoreContextType {
  orders: Order[];
  products: Product[];
  customRequests: CustomRequest[];
  isLoading: boolean;
  activeStatusFilter: OrderStatus | "all";
  setActiveStatusFilter: (status: OrderStatus | "all") => void;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    carrier?: string,
    trackingNum?: string,
    notes?: string
  ) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  addProduct: (product: Omit<Product, "id" | "created_at">) => Promise<boolean>;
  toggleProductStatus: (productId: string, field: "is_available" | "is_featured" | "is_published") => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateCustomRequestStatus: (
    requestId: string,
    status: CustomRequest["status"],
    quotedPrice?: number,
    notes?: string
  ) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}

const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

const SEED_ORDERS: Order[] = [];

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "couples-line-art-embroidered-handkerchief",
    name: "Couples Line Art Embroidered Handkerchief",
    category_slug: "handkerchief-embroidery",
    short_description: "Pure cotton handkerchief embroidered with minimalist line art.",
    description: "Handcrafted 100% white cotton handkerchief featuring intricate embroidery.",
    price: 650,
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    is_new: true,
    is_published: true,
    image_url: "/products/handkerchief-iloveu-embroidery.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    slug: "a-bouquet-that-never-fades",
    name: "A Bouquet That Never Fades",
    category_slug: "handmade-bouquets",
    short_description: "Everlasting crochet orchid and botanical floral bouquet.",
    description: "Crocheted with premium milk cotton yarn in soothing shades.",
    price: 1850,
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    is_new: false,
    is_published: true,
    image_url: "/products/orchid-bouquet-never-fades.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    slug: "kgt-crochet-keychain",
    name: "Custom 3-Letter Crochet Keychain",
    category_slug: "keychains-charms",
    short_description: "Personalized crochet name initials with daisy charm.",
    description: "Hand-stitched letter initials with sturdy silver hardware.",
    price: 350,
    is_available: true,
    is_featured: false,
    is_bestseller: true,
    is_new: false,
    is_published: true,
    image_url: "/products/kgt-crochet-keychain.jpg",
    created_at: new Date().toISOString(),
  },
];

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeStatusFilter, setActiveStatusFilter] = useState<OrderStatus | "all">("all");

  const refreshAllData = async (silent: boolean = false) => {
    if (!silent) setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: dbOrders, error: ordersErr } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!ordersErr) {
          setOrders((dbOrders || []) as Order[]);
        }

        const { data: dbProducts, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbProducts && !prodErr) {
          setProducts(dbProducts as Product[]);
        }

        const { data: dbCustom } = await supabase
          .from("custom_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbCustom) {
          setCustomRequests(dbCustom as CustomRequest[]);
        }
      } else {
        // Load saved state from localStorage if offline
        const localOrders = localStorage.getItem("artbythread_admin_orders");
        if (localOrders) {
          setOrders(JSON.parse(localOrders));
        }
        const localProducts = localStorage.getItem("artbythread_admin_products");
        if (localProducts) {
          setProducts(JSON.parse(localProducts));
        }
      }
    } catch (err) {
      console.warn("[ADMIN REFRESH DATA ERROR]", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData(false);

    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    // 1. Live Realtime Supabase Database Listener (WebSockets)
    const channel = supabase
      .channel("admin-live-orders-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrd = payload.new as Order;
            setOrders((prev) => {
              const exists = prev.some((o) => o.order_id === newOrd.order_id || o.id === newOrd.id);
              if (exists) return prev;
              return [newOrd, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedOrd = payload.new as Order;
            setOrders((prev) =>
              prev.map((o) => (o.order_id === updatedOrd.order_id || o.id === updatedOrd.id ? updatedOrd : o))
            );
          } else if (payload.eventType === "DELETE") {
            const oldOrd = payload.old as Partial<Order>;
            setOrders((prev) => prev.filter((o) => o.id !== oldOrd.id && o.order_id !== oldOrd.order_id));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "custom_requests" },
        () => {
          refreshAllData(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          refreshAllData(true);
        }
      )
      .subscribe();

    // 2. Continuous Background Polling (Every 8 seconds) as seamless fallback
    const pollTimer = setInterval(() => {
      refreshAllData(true);
    }, 8000);

    // 3. Auto-sync on Tab Focus (when admin returns to this browser window)
    const handleFocus = () => {
      refreshAllData(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      if (supabase) supabase.removeChannel(channel);
      clearInterval(pollTimer);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Save to local storage on mutation when Supabase is not connected
  const persistOrders = (updated: Order[]) => {
    setOrders(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("artbythread_admin_orders", JSON.stringify(updated));
      // Also sync to customer store shared key
      localStorage.setItem("artbythread_customer_orders", JSON.stringify(updated));
    }
  };

  const persistProducts = (updated: Product[]) => {
    setProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("artbythread_admin_products", JSON.stringify(updated));
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    carrier?: string,
    trackingNum?: string,
    notes?: string
  ): Promise<boolean> => {
    const updated = orders.map((ord) => {
      if (ord.order_id === orderId || ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          shipping_carrier: carrier !== undefined ? carrier : ord.shipping_carrier,
          tracking_number: trackingNum !== undefined ? trackingNum : ord.tracking_number,
          admin_notes: notes !== undefined ? notes : ord.admin_notes,
          updated_at: new Date().toISOString(),
        };
      }
      return ord;
    });

    persistOrders(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("orders")
          .update({
            status: newStatus,
            shipping_carrier: carrier,
            tracking_number: trackingNum,
            admin_notes: notes,
            updated_at: new Date().toISOString(),
          })
          .or(`order_id.eq.${orderId},id.eq.${orderId}`);
      } catch (err) {
        console.warn("[SUPABASE ORDER UPDATE WARNING]", err);
      }
    }

    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const updated = orders.filter((o) => o.order_id !== orderId && o.id !== orderId);
    persistOrders(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").delete().or(`order_id.eq.${orderId},id.eq.${orderId}`);
      } catch (err) {
        console.warn("[SUPABASE ORDER DELETE WARNING]", err);
      }
    }
    return true;
  };

  const addProduct = async (productData: Omit<Product, "id" | "created_at">): Promise<boolean> => {
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    persistProducts(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").insert([newProduct]);
      } catch (err) {
        console.warn("[SUPABASE ADD PRODUCT WARNING]", err);
      }
    }
    return true;
  };

  const toggleProductStatus = async (
    productId: string,
    field: "is_available" | "is_featured" | "is_published"
  ): Promise<boolean> => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    });
    persistProducts(updated);

    if (isSupabaseConfigured && supabase) {
      const target = updated.find((p) => p.id === productId);
      if (target) {
        try {
          await supabase
            .from("products")
            .update({ [field]: target[field] })
            .eq("id", productId);
        } catch (err) {
          console.warn("[SUPABASE TOGGLE PRODUCT WARNING]", err);
        }
      }
    }
    return true;
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    const updated = products.filter((p) => p.id !== productId);
    persistProducts(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", productId);
      } catch (err) {
        console.warn("[SUPABASE DELETE PRODUCT WARNING]", err);
      }
    }
    return true;
  };

  const updateCustomRequestStatus = async (
    requestId: string,
    status: CustomRequest["status"],
    quotedPrice?: number,
    notes?: string
  ): Promise<boolean> => {
    const updated = customRequests.map((req) => {
      if (req.request_id === requestId || req.id === requestId) {
        return {
          ...req,
          status,
          quoted_price: quotedPrice !== undefined ? quotedPrice : req.quoted_price,
          admin_notes: notes !== undefined ? notes : req.admin_notes,
        };
      }
      return req;
    });
    setCustomRequests(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("custom_requests")
          .update({
            status,
            quoted_price: quotedPrice,
            admin_notes: notes,
          })
          .or(`request_id.eq.${requestId},id.eq.${requestId}`);
      } catch (err) {
        console.warn("[SUPABASE CUSTOM REQUEST UPDATE WARNING]", err);
      }
    }
    return true;
  };

  return (
    <AdminStoreContext.Provider
      value={{
        orders,
        products,
        customRequests,
        isLoading,
        activeStatusFilter,
        setActiveStatusFilter,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        toggleProductStatus,
        deleteProduct,
        updateCustomRequestStatus,
        refreshAllData,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
}
