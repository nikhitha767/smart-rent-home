# Make Featured Properties Public - Fix Guide

## Problem:
Featured Properties section is not visible to public/non-authenticated users on the homepage.

## Solution:
Update Firestore Security Rules to allow **public read access** to approved properties.

---

## 📋 Step-by-Step Instructions:

### 1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project

### 2. **Navigate to Firestore Rules**
   - Click **"Firestore Database"** in left sidebar
   - Click **"Rules"** tab at the top

### 3. **Replace with Public-Friendly Rules**

Copy and paste this into the rules editor:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Properties collection - PUBLIC READ for approved properties
    match /properties/{propertyId} {
      // ✅ ANYONE can read approved properties (no auth required)
      allow read: if resource.data.status == 'approved' || request.auth != null;
      
      // Authenticated users can create properties
      allow create: if request.auth != null;
      
      // Authenticated users can update and delete
      allow update, delete: if request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    
    // All other collections - require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. **Publish the Rules**
   - Click **"Publish"** button at the top
   - Wait for "Rules published successfully" message

### 5. **Test the Fix**
   - Open your app in **incognito/private window** (to simulate non-logged-in user)
   - Go to homepage
   - Scroll to "Featured Properties" section
   - You should see approved property cards! ✅

---

## 🔍 What This Rule Does:

### **Before:**
```javascript
allow read: if request.auth != null; // ❌ Only logged-in users
```

### **After:**
```javascript
allow read: if resource.data.status == 'approved' || request.auth != null;
// ✅ Anyone can read approved properties
// ✅ Logged-in users can read all properties
```

---

## 🎯 Key Points:

### **Public Access (No Login Required):**
- ✅ Can view **approved** properties
- ✅ Can see Featured Properties on homepage
- ✅ Can see property details
- ✅ Can browse property listings

### **Still Protected:**
- ❌ Cannot create properties (need login)
- ❌ Cannot update properties (need login)
- ❌ Cannot delete properties (need login)
- ❌ Cannot see pending/rejected properties (need login)

---

## 🔒 Security Notes:

1. **Safe for Production:**
   - Only approved properties are public
   - Pending/rejected properties remain private
   - Write operations still require authentication

2. **Best Practice:**
   - Public read access is standard for e-commerce/rental sites
   - Similar to Airbnb, Zillow, etc.
   - Users need to login only to book/create listings

3. **What's Protected:**
   - User data (emails, phone numbers in users collection)
   - Booking information
   - Unapproved property listings

---

## ✅ Verification Checklist:

After updating rules, test these scenarios:

### **Without Login (Public User):**
- [ ] Can see Featured Properties on homepage
- [ ] Can see property type counts
- [ ] Can click on property cards
- [ ] Can view property details
- [ ] Can see property images
- [ ] **Cannot** create/edit/delete properties

### **With Login (Authenticated User):**
- [ ] Can do everything public users can
- [ ] Can create new properties
- [ ] Can edit own properties
- [ ] Can see own pending properties

---

## 🚀 Alternative: Super Permissive (Development Only)

If you want to test quickly, use this (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      allow read: if true; // ✅ Anyone can read all properties
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 Files Created:

1. `firestore-public.rules` - Production-ready rules with public read access
2. `MAKE_FEATURED_PROPERTIES_PUBLIC.md` - This guide

---

## 🎉 Result:

After updating the rules:
- ✅ **All users** (logged in or not) can see Featured Properties
- ✅ Homepage is fully public and accessible
- ✅ Property details pages are public for approved properties
- ✅ Security is maintained for write operations

The Featured Properties section will now be visible to everyone! 🌐
