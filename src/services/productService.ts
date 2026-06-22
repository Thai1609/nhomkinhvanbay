import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Product, Category, Pricing } from "../types";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const PRODUCTS_COLLECTION = "products";

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product & { id: string },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    return []; // Should not reach here due to throw
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("slug", "==", slug),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Product & { id: string };
    }
    return null;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.GET,
      `${PRODUCTS_COLLECTION}/${slug}`,
    );
    return null;
  }
};

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Category & { id: string },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "categories");
    return [];
  }
};

export const addCategory = async (category: Omit<Category, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      ownerId: auth.currentUser?.uid,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "categories");
  }
};

export const updateCategory = async (
  id: string,
  category: Partial<Category>,
) => {
  try {
    const docRef = doc(db, "categories", id);
    const { id: _, ...dataToSave } = category as any;
    await updateDoc(docRef, {
      ...dataToSave,
      ownerId: auth.currentUser?.uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
  }
};

export const addProduct = async (product: Omit<Product, "id">) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      ownerId: auth.currentUser?.uid,
      createdBy: auth.currentUser?.email,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const { id: _, ...dataToSave } = product as any;
    await updateDoc(docRef, {
      ...dataToSave,
      ownerId: auth.currentUser?.uid, // Ensure ownerId remains or is updated correctly if needed (rules usually check this)
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `${PRODUCTS_COLLECTION}/${id}`,
    );
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `${PRODUCTS_COLLECTION}/${id}`
    );
  }
};

export const getPricing = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pricing"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Pricing & { id: string }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "pricing");
    return [];
  }
};

export const addPricing = async (pricing: Omit<Pricing, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "pricing"), {
      ...pricing,
      ownerId: auth.currentUser?.uid,
      createdBy: auth.currentUser?.email,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "pricing");
  }
};

export const updatePricing = async (id: string, pricing: Partial<Pricing>) => {
  try {
    const docRef = doc(db, "pricing", id);
    const { id: _, ...dataToSave } = pricing as any;
    await updateDoc(docRef, {
      ...dataToSave,
      ownerId: auth.currentUser?.uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `pricing/${id}`);
  }
};

export const deletePricing = async (id: string) => {
  try {
    await deleteDoc(doc(db, "pricing", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pricing/${id}`);
  }
};
