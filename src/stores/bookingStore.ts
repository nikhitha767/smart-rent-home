// Simple booking store using localStorage for persistence across components

export interface BookingRequest {
  id: string;
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
  createdAt: string;
}

const STORAGE_KEY = "booking_requests";

export const getBookingRequests = (): BookingRequest[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addBookingRequest = (request: Omit<BookingRequest, "id" | "status" | "createdAt">): BookingRequest => {
  const requests = getBookingRequests();
  const newRequest: BookingRequest = {
    ...request,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return newRequest;
};

export const getRequestsByOwner = (ownerId: string): BookingRequest[] => {
  return getBookingRequests().filter(req => req.ownerId === ownerId);
};

export const getRequestsByUser = (userEmail: string): BookingRequest[] => {
  return getBookingRequests().filter(req => req.userEmail === userEmail);
};

export const updateRequestStatus = (requestId: string, status: "approved" | "rejected"): BookingRequest | null => {
  const requests = getBookingRequests();
  const index = requests.findIndex(req => req.id === requestId);
  if (index !== -1) {
    requests[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return requests[index];
  }
  return null;
};

export const getApprovedBookingsForUser = (userEmail: string): BookingRequest[] => {
  return getBookingRequests().filter(req => req.userEmail === userEmail && req.status === "approved");
};
