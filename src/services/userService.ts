import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface UserProfile {
    uid: string;
    email: string;
    role: "tenant" | "owner" | "admin";
    createdAt: string;
}

export const createUser = async () => {
    // Implementation will be added
};
export const getUser = async () => {
    // Implementation will be added
};

export const createUserProfile = async (uid: string, email: string) => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const newUser: UserProfile = {
                uid,
                email,
                role: "tenant", // Default role
                createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newUser);
        }
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const getUserRole = async (uid: string): Promise<string | null> => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return (userSnap.data() as UserProfile).role;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
};

export const updateUserRole = async (uid: string, role: "tenant" | "owner" | "admin") => {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { role }, { merge: true });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};
