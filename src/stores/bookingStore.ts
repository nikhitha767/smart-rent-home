// Booking store using Firebase Firestore for real-time persistence

import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export interface BookingRequest {
  id: string;
  propertyId: string; // Added to link to specific property
  ownerId: string;
  ownerName: string;
  propertyName: string;
  propertyImage: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  moveInDate: string;
  duration: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
}

// Add a new booking request to Firebase
export const addBookingRequest = async (request: Omit<BookingRequest, "id" | "status" | "createdAt">): Promise<BookingRequest> => {
  try {
    const newRequest = {
      ...request,
      status: "pending" as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "bookings"), newRequest);

    return {
      ...newRequest,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding booking request:", error);
    throw error;
  }
};

// Get booking requests by owner ID (real-time)
export const getRequestsByOwner = (ownerId: string, callback: (requests: BookingRequest[]) => void): (() => void) => {
  const q = query(
    collection(db, "bookings"),
    where("ownerId", "==", ownerId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests: BookingRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        propertyId: data.propertyId || "",
        ownerId: data.ownerId || "",
        ownerName: data.ownerName || "",
        propertyName: data.propertyName || "",
        propertyImage: data.propertyImage || "",
        userName: data.userName || "",
        userEmail: data.userEmail || "",
        userPhone: data.userPhone || "",
        moveInDate: data.moveInDate || "",
        duration: data.duration || "",
        message: data.message || "",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    callback(requests);
  }, (error) => {
    console.error("Error fetching booking requests:", error);
    callback([]);
  });

  return unsubscribe;
};

// Get booking requests by user email (real-time)
export const getRequestsByUser = (userEmail: string, callback: (requests: BookingRequest[]) => void): (() => void) => {
  const q = query(
    collection(db, "bookings"),
    where("userEmail", "==", userEmail)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests: BookingRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        propertyId: data.propertyId || "",
        ownerId: data.ownerId || "",
        ownerName: data.ownerName || "",
        propertyName: data.propertyName || "",
        propertyImage: data.propertyImage || "",
        userName: data.userName || "",
        userEmail: data.userEmail || "",
        userPhone: data.userPhone || "",
        moveInDate: data.moveInDate || "",
        duration: data.duration || "",
        message: data.message || "",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    callback(requests);
  });

  return unsubscribe;
};

// Update booking request status
export const updateRequestStatus = async (requestId: string, status: "approved" | "rejected"): Promise<void> => {
  try {
    const requestRef = doc(db, "bookings", requestId);
    await updateDoc(requestRef, {
      status: status,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// Get approved bookings for a user
export const getApprovedBookingsForUser = (userEmail: string, callback: (requests: BookingRequest[]) => void): (() => void) => {
  const q = query(
    collection(db, "bookings"),
    where("userEmail", "==", userEmail),
    where("status", "==", "approved")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests: BookingRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        propertyId: data.propertyId || "",
        ownerId: data.ownerId || "",
        ownerName: data.ownerName || "",
        propertyName: data.propertyName || "",
        propertyImage: data.propertyImage || "",
        userName: data.userName || "",
        userEmail: data.userEmail || "",
        userPhone: data.userPhone || "",
        moveInDate: data.moveInDate || "",
        duration: data.duration || "",
        message: data.message || "",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });
    callback(requests);
  });

  return unsubscribe;
};

// Legacy function for backward compatibility (returns empty array, use real-time listeners instead)
export const getBookingRequests = (): BookingRequest[] => {
  console.warn("getBookingRequests() is deprecated. Use real-time listeners instead.");
  return [];
};
