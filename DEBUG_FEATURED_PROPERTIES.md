# Featured Properties Not Showing - Debug Guide

## Problem:
"No properties available yet. Check back soon!" is showing instead of property cards.

## Possible Causes & Solutions:

### 1. **No Approved Properties in Database**

**Check:**
1. Open Firebase Console → Firestore Database
2. Look at the `properties` collection
3. Check if any properties have `status: "approved"`

**Solution:**
- Go to Admin Dashboard (`/admin`)
- Look at the Properties tab
- Find properties with "Pending" status
- Click "Approve" button on at least one property
- The property should appear on homepage immediately

---

### 2. **Firestore Security Rules Blocking Read**

**Check Browser Console:**
- Open browser DevTools (F12)
- Look for errors like "Missing or insufficient permissions"

**Solution:**
Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      // Allow anyone to read approved properties
      allow read: if resource.data.status == 'approved' || request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### 3. **Check Browser Console Logs**

After my fix, you should see these console logs:

```
FeaturedProperties: Starting to fetch approved properties...
FeaturedProperties: Snapshot received, size: X
Property found: [property-id] {...data...}
FeaturedProperties: Total properties loaded: X
```

**What to look for:**
- If `size: 0` → No approved properties in database
- If you see permission error → Update Firestore rules
- If properties load but don't show → Check the data structure

---

### 4. **Quick Test Steps**

#### **Step 1: Check if you have any properties**
1. Go to `/owner/dashboard`
2. Upload a property if you haven't
3. Check if it appears in "My Properties"

#### **Step 2: Approve a property**
1. Go to `/admin`
2. Click "Properties" tab
3. You should see properties with "Pending" status
4. Click "Approve" on one property
5. Status should change to "Approved" (green)

#### **Step 3: Check homepage**
1. Go to homepage (`/`)
2. Scroll to "Featured Properties" section
3. You should now see the approved property!

---

### 5. **Manual Database Check**

**In Firebase Console:**
1. Go to Firestore Database
2. Open `properties` collection
3. Click on any document
4. Check these fields:
   - `status` should be `"approved"` (not `"pending_verification"`)
   - `propertyName` should exist
   - `rent` should be a number
   - `city` should exist
   - `images` array should have at least one URL

**If status is wrong:**
- Click on the `status` field
- Change value to `"approved"`
- Click "Update"

---

### 6. **Common Issues**

| Issue | Cause | Fix |
|-------|-------|-----|
| "No properties available" | No approved properties | Approve at least one property in Admin panel |
| Permission error | Firestore rules too strict | Update rules to allow public read |
| Properties not loading | Firebase not initialized | Check browser console for errors |
| Empty cards | Missing data fields | Ensure property has all required fields |

---

### 7. **Debug Checklist**

- [ ] At least one property exists in Firestore
- [ ] Property status is "approved" (not "pending_verification")
- [ ] Firestore rules allow reading approved properties
- [ ] No errors in browser console
- [ ] Firebase is properly initialized
- [ ] Property has required fields (name, rent, city, images)

---

### 8. **Quick Fix Commands**

**Check browser console:**
```
Press F12 → Console tab → Look for:
"FeaturedProperties: Total properties loaded: X"
```

**If X = 0:**
- No approved properties → Go approve some in Admin panel

**If you see permission error:**
- Update Firestore rules as shown above

---

### 9. **Test with Sample Data**

If you want to test quickly, manually add a property in Firebase Console:

1. Go to Firestore Database
2. Click "Start collection" or open `properties`
3. Add document with auto-ID
4. Add these fields:
   ```
   propertyName: "Test Property"
   propertyType: "Apartment"
   rent: 15000
   city: "Bangalore"
   locality: "Koramangala"
   state: "Karnataka"
   status: "approved"
   images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]
   ownerName: "Test Owner"
   bedrooms: 2
   bathrooms: 2
   area: 1200
   uid: "test-user-id"
   ```
5. Save
6. Refresh homepage → Property should appear!

---

## Expected Result:

After fixing, you should see:
- ✅ Property cards with images
- ✅ Property name, location, rent
- ✅ Bedrooms, bathrooms, area
- ✅ "View Details" button
- ✅ "View All Properties" button at bottom

---

## Still Not Working?

Check browser console and share the logs:
1. Press F12
2. Go to Console tab
3. Look for lines starting with "FeaturedProperties:"
4. Share what you see
