"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AnalyticsStats,
  Category,
  Collection,
  CustomRequest,
  CustomRequestStatus,
  FAQItem,
  GalleryItem,
  OrderEnquiry,
  OrderStatus,
  Product,
  SiteSettings,
  Testimonial,
} from "./types";
import {
  initialCategories,
  initialCollections,
  initialFAQs,
  initialGalleryItems,
  initialProducts,
  initialSiteSettings,
  initialTestimonials,
} from "./data";
import { isSupabaseConfigured, supabase } from "./supabase";

interface StoreContextType {
  // State
  settings: SiteSettings;
  products: Product[];
  categories: Category[];
  collections: Collection[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  customRequests: CustomRequest[];
  orderEnquiries: OrderEnquiry[];
  analytics: AnalyticsStats;
  isAdminAuthenticated: boolean;
  isSearchOpen: boolean;

  // Actions
  setIsSearchOpen: (open: boolean) => void;
  setAdminAuthenticated: (auth: boolean) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Product actions
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getFeaturedProducts: () => Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Custom request actions
  submitCustomRequest: (request: Omit<CustomRequest, "id" | "request_id" | "created_at" | "status"> & { request_id?: string }) => Promise<CustomRequest>;
  updateCustomRequestStatus: (id: string, status: CustomRequestStatus, adminNotes?: string, quotedPrice?: number) => void;

  // Order enquiry actions
  submitOrderEnquiry: (enquiry: Omit<OrderEnquiry, "id" | "order_id" | "created_at" | "status">) => Promise<OrderEnquiry>;
  updateOrderEnquiryStatus: (
    id: string,
    status: OrderStatus,
    adminNotes?: string,
    extraFields?: Partial<OrderEnquiry>
  ) => void;

  // Gallery actions
  saveGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Testimonial actions
  saveTestimonial: (item: Testimonial) => void;
  toggleTestimonialApproval: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  // FAQ actions
  saveFAQ: (item: FAQItem) => void;
  deleteFAQ: (id: string) => void;

  // Analytics
  trackEvent: (
    eventName: "whatsapp_click" | "instagram_click" | "email_click" | "custom_request_submit" | "product_view" | "page_visit",
    meta?: Record<string, unknown>
  ) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY_PREFIX = "artbythread_store_";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [orderEnquiries, setOrderEnquiries] = useState<OrderEnquiry[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<AnalyticsStats>({
    whatsapp_clicks: 142,
    instagram_clicks: 298,
    email_clicks: 45,
    custom_requests_count: 24,
    total_product_views: 1840,
    total_site_visits: 3420,
  });

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedProducts = localStorage.getItem(`${STORAGE_KEY_PREFIX}products`);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedRequests = localStorage.getItem(`${STORAGE_KEY_PREFIX}custom_requests`);
      if (savedRequests) setCustomRequests(JSON.parse(savedRequests));

      const savedEnquiries = localStorage.getItem(`${STORAGE_KEY_PREFIX}order_enquiries`);
      if (savedEnquiries) setOrderEnquiries(JSON.parse(savedEnquiries));

      const savedAuth = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}admin_auth`);
      if (savedAuth === "true") setIsAdminAuthenticated(true);
    } catch (e) {
      console.warn("Failed to load store state from localStorage:", e);
    }
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings, updated_at: new Date().toISOString() };
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

  const getProductsByCategory = (categorySlug: string) =>
    products.filter((p) => p.category === categorySlug && p.is_published);

  const getFeaturedProducts = () => products.filter((p) => p.is_featured && p.is_published);

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      let updated: Product[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = product;
      } else {
        updated = [product, ...prev];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}products`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}products`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const submitCustomRequest = async (
    requestData: Omit<CustomRequest, "id" | "request_id" | "created_at" | "status"> & { request_id?: string }
  ): Promise<CustomRequest> => {
    const year = new Date().getFullYear();
    const reqId = requestData.request_id || `CUST-${year}-${String(Math.floor(100000 + Math.random() * 900000))}`;

    const newRequest: CustomRequest = {
      ...requestData,
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      request_id: reqId,
      status: "NEW",
      created_at: new Date().toISOString(),
    };

    setCustomRequests((prev) => {
      const updated = [newRequest, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}custom_requests`, JSON.stringify(updated));
      }
      return updated;
    });

    trackEvent("custom_request_submit", { creation_type: newRequest.creation_type });

    // Save to Supabase if available
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("custom_requests").insert([
          {
            request_id: reqId,
            full_name: newRequest.full_name,
            phone: newRequest.phone,
            email: newRequest.email,
            creation_type: newRequest.creation_type,
            description: newRequest.description,
            reference_image_url: newRequest.reference_image_url || null,
            approximate_size: newRequest.approximate_size || null,
            color_palette: newRequest.color_palette || [],
            quantity: newRequest.quantity || 1,
            target_date: newRequest.target_date || null,
            delivery_address: newRequest.delivery_address || null,
            additional_notes: newRequest.additional_notes || null,
            status: "NEW",
          },
        ]);
      } catch (err) {
        console.warn("Supabase custom_requests insert warning:", err);
      }
    }

    return newRequest;
  };

  const updateCustomRequestStatus = (
    id: string,
    status: CustomRequestStatus,
    adminNotes?: string,
    quotedPrice?: number
  ) => {
    setCustomRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id || req.request_id === id
          ? {
              ...req,
              status,
              admin_notes: adminNotes ?? req.admin_notes,
              quoted_price: quotedPrice ?? req.quoted_price,
            }
          : req
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}custom_requests`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const saveGalleryItem = (item: GalleryItem) => {
    setGalleryItems((prev) => {
      const index = prev.findIndex((g) => g.id === item.id);
      let updated: GalleryItem[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = item;
      } else {
        updated = [item, ...prev];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}gallery`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}gallery`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const saveTestimonial = (item: Testimonial) => {
    setTestimonials((prev) => {
      const index = prev.findIndex((t) => t.id === item.id);
      let updated: Testimonial[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = item;
      } else {
        updated = [item, ...prev];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}testimonials`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleTestimonialApproval = (id: string) => {
    setTestimonials((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, is_approved: !t.is_approved } : t));
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}testimonials`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}testimonials`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const saveFAQ = (item: FAQItem) => {
    setFaqs((prev) => {
      const index = prev.findIndex((f) => f.id === item.id);
      let updated: FAQItem[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = item;
      } else {
        updated = [...prev, item];
      }
      return updated;
    });
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const setAdminAuthenticated = (auth: boolean) => {
    setIsAdminAuthenticated(auth);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}admin_auth`, auth ? "true" : "false");
    }
  };

  const trackEvent = (
    eventName: "whatsapp_click" | "instagram_click" | "email_click" | "custom_request_submit" | "product_view" | "page_visit",
    meta?: Record<string, unknown>
  ) => {
    setAnalytics((prev) => {
      const updated = { ...prev };
      if (eventName === "whatsapp_click") updated.whatsapp_clicks += 1;
      if (eventName === "instagram_click") updated.instagram_clicks += 1;
      if (eventName === "email_click") updated.email_clicks += 1;
      if (eventName === "custom_request_submit") updated.custom_requests_count += 1;
      if (eventName === "product_view") updated.total_product_views += 1;
      if (eventName === "page_visit") updated.total_site_visits += 1;
      return updated;
    });
  };

  const submitOrderEnquiry = async (
    enquiryData: Omit<OrderEnquiry, "id" | "order_id" | "created_at" | "status">
  ): Promise<OrderEnquiry> => {
    let generatedOrderId = `AT7-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: enquiryData.customer_name,
          customer_phone: enquiryData.customer_phone || "+91 97731 94319",
          customer_email: enquiryData.customer_email || "customer@example.com",
          preferred_channel: (enquiryData.preferred_channel || enquiryData.channel || "whatsapp").replace("_form", ""),
          quantity: enquiryData.quantity || 1,
          customization_note: enquiryData.customization_note || enquiryData.customization_details || "",
          delivery_city: enquiryData.delivery_city || enquiryData.city || "India",
          product_id: enquiryData.product_id || "",
          product_name: enquiryData.product_name,
          product_photo_url: enquiryData.product_photo_url || enquiryData.product_image_url || "",
          product_sku: enquiryData.product_sku || "",
          product_price: enquiryData.quoted_price ?? null,
          size_variant: enquiryData.size_variant || "Standard Size",
          address: enquiryData.address || "",
          state: enquiryData.state || "",
          pincode: enquiryData.pincode || "",
        }),
      });
      const data = await res.json();
      if (data?.order_id) {
        generatedOrderId = data.order_id;
      }
    } catch (err) {
      console.warn("Error calling /api/orders:", err);
    }

    const newEnquiry: OrderEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order_id: generatedOrderId,
      status: "new",
      created_at: new Date().toISOString(),
    };

    setOrderEnquiries((prev) => {
      const updated = [newEnquiry, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}order_enquiries`, JSON.stringify(updated));
      }
      return updated;
    });

    trackEvent(
      (enquiryData.preferred_channel || enquiryData.channel) === "whatsapp"
        ? "whatsapp_click"
        : (enquiryData.preferred_channel || enquiryData.channel) === "instagram"
        ? "instagram_click"
        : "email_click",
      {
        product_name: enquiryData.product_name,
        order_id: generatedOrderId,
      }
    );

    return newEnquiry;
  };

  const updateOrderEnquiryStatus = (
    id: string,
    status: OrderStatus,
    adminNotes?: string,
    extraFields?: Partial<OrderEnquiry>
  ) => {
    setOrderEnquiries((prev) => {
      const updated = prev.map((enq) =>
        enq.id === id || enq.order_id === id
          ? {
              ...enq,
              status,
              admin_notes: adminNotes ?? enq.admin_notes,
              ...extraFields,
              updated_at: new Date().toISOString(),
            }
          : enq
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}order_enquiries`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        products,
        categories,
        collections,
        galleryItems,
        testimonials,
        faqs,
        customRequests,
        orderEnquiries,
        analytics,
        isAdminAuthenticated,
        isSearchOpen,
        setIsSearchOpen,
        setAdminAuthenticated,
        updateSettings,
        getProductBySlug,
        getProductsByCategory,
        getFeaturedProducts,
        saveProduct,
        deleteProduct,
        submitCustomRequest,
        updateCustomRequestStatus,
        submitOrderEnquiry,
        updateOrderEnquiryStatus,
        saveGalleryItem,
        deleteGalleryItem,
        saveTestimonial,
        toggleTestimonialApproval,
        deleteTestimonial,
        saveFAQ,
        deleteFAQ,
        trackEvent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
