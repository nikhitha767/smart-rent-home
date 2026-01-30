# Firebase Storage Setup Guide

## Quick Setup Steps

### 1. Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **house-rent-ai**
3. Click **Storage** in the left sidebar
4. Click **Get Started**
5. Click **Next** on the security rules dialog
6. Select your location (choose closest to your users)
7. Click **Done**

### 2. Update Security Rules

After enabling Storage, update the security rules:

1. In Firebase Console → Storage → Rules tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload property images
    match /properties/{propertyId}/{allPaths=**} {
      allow write: if request.auth != null;
      allow read: if true;
    }
  }
}
```

3. Click **Publish**

### 3. Test the Application

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to the Owner Form:
   - Click "List Property" or "Become Owner"

3. Test the complete flow:
   - **Step 1:** Enter city and address (map should auto-update)
   - **Step 2:** Upload 1-4 images
   - **Step 3:** Fill property details (type, rent, phone, etc.)
   - **Step 4:** Review and submit

4. Check Firebase Console:
   - Go to Storage → Files
   - You should see `properties/{id}/` folder with your images

5. Check Firestore:
   - Go to Firestore Database
   - Find your property document
   - Verify `images` field contains Firebase Storage URLs
   - Verify `status` is "pending_verification"

### 4. Test Admin Approval

1. Navigate to Admin Dashboard:
   ```
   http://localhost:8080/admin
   ```

2. You should see your property in "Pending Approvals"

3. Click "AI Analysis" button

4. Click "Approve"

5. Property should now appear in public search

### 5. Verify Public Display

1. Navigate to Dashboard:
   ```
   http://localhost:8080/dashboard
   ```

2. Search for properties

3. Only approved properties should appear

---

## Troubleshooting

### Error: "Firebase Storage is not enabled"

**Solution:** Follow Step 1 above to enable Storage in Firebase Console

### Error: "Permission denied"

**Solution:** 
- Make sure you're logged in
- Check security rules are published correctly

### Images not uploading

**Solution:**
- Check browser console for errors
- Verify Firebase Storage is enabled
- Check file size (should be under 5MB)

### Map not updating

**Solution:**
- Check internet connection (needs OpenStreetMap API)
- Wait 1 second after typing (debounced)
- Check browser console for errors

---

## Features to Test

- [x] Upload 1 image
- [x] Upload 4 images
- [x] Remove individual images
- [x] Add more images after initial upload
- [x] Type city and see map update
- [x] Click "Locate Me" button
- [x] Select property type
- [x] Check outdoor spaces (garden, balcony, terrace)
- [x] Submit form
- [x] See upload progress
- [x] Admin approval workflow
- [x] Public filtering (only approved properties)

---

## What's New

### Owner Form (4 Steps)

1. **Location** - Map with auto-geocoding
2. **Images** - Upload up to 4 photos
3. **Details** - Property type, phone, outdoor spaces
4. **Review** - Preview and submit for admin review

### Key Features

- 🗺️ Smart map that updates as you type
- 📸 Multiple image upload with preview
- 🏠 Visual property type selector
- 🌳 Outdoor space checkboxes
- 📞 Phone number field
- ✅ Admin approval workflow
- 📊 Upload progress tracking

---

**Ready to test!** Start by enabling Firebase Storage, then try creating a property listing.
