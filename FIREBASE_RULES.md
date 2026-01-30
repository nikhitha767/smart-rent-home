# Firestore Security Rules

It looks like your application is getting a "Missing or insufficient permissions" error. This is because the default Firestore security rules often deny writes by default.

To fix this, go to your [Firebase Console](https://console.firebase.google.com/), navigate to **Firestore Database** > **Rules**, and replace the existing rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles
    // Allow users to read and write only their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Properties
    // Allow anyone to read properties (so they can be displayed on the site)
    // Allow authenticated users to create (list) properties
    // Allow owners to update/delete ONLY their own properties
    match /properties/{propertyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    
    // Default deny for everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish** to apply these rules. Your app should work immediately after this.
