import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Mail, Calendar } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: any;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for users from Firebase Auth
    // Note: Firebase Auth users are not directly queryable from Firestore
    // We'll fetch from a 'users' collection if you create one, or use Firebase Auth Admin SDK

    // For now, let's check if you have a users collection
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersList.push({
          id: doc.id,
          email: data.email || "",
          displayName: data.displayName || data.name || "User",
          role: data.role || "user",
          createdAt: data.createdAt,
        });
      });
      setUsers(usersList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            All Users
            <Badge variant="secondary">{users.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {(user.displayName || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.displayName || "User"}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {formatDate(user.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                    {user.role || "user"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No users registered yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Users will appear here when they sign up.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
