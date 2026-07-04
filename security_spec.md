# Firebase Security Specification - Bek Mebeli

This document details the security model, data invariants, exploit payloads ("Dirty Dozen"), and validation requirements for the Bek Mebeli Firebase Firestore implementation.

## 1. Data Invariants

1. **Admins Collection (`/admins/{userId}`)**:
   - Only existing authenticated admins can create or delete other admins.
   - Bootstrapped Admin: `tuyginovsardor@gmail.com` must be allowed admin-level access initially, and we will model this by checking the admin's document presence or via custom database logic if needed. However, since client auth claims are not trustable, we will store admins directly in the `/admins` collection. The user `tuyginovsardor@gmail.com` will be bootstrapped in the app's startup code by adding their record if they log in.
   - Admin record fields: `email` (string), `assignedAt` (timestamp), `assignedBy` (string/email).

2. **Bookings Collection (`/bookings/{bookingId}`)**:
   - Authenticated or anonymous users can create bookings.
   - If a booking has a `userId` field matching an authenticated user's ID, only that user or an Admin can read/update it.
   - General users cannot update the `adminNote` field or change the booking status directly to a terminal state (except maybe "bekor_qilindi" by the owner).
   - Only admins can read all bookings.
   - Standard fields: `fullName` (string, size 2-100), `phone` (string, size 9-25), `category` (string, size 2-100), `message` (string, max 1000), `status` (string, enum), `createdAt` (timestamp), `updatedAt` (timestamp), `userId` (string).

3. **Categories Collection (`/categories/{categoryId}`)**:
   - Anyone can read categories.
   - Only Admins can create, update, or delete categories.
   - Strict size and format constraints apply.

4. **Testimonials Collection (`/testimonials/{testimonialId}`)**:
   - Anyone can read testimonials.
   - Admins can manage all testimonials. Users can submit new testimonials if authenticated.

5. **Settings Collection (`/settings/contact_info`)**:
   - Anyone can read settings.
   - Only Admins can update settings.

---

## 2. The "Dirty Dozen" Payloads

Here are 12 specific JSON payloads designed to violate system rules and how the Firestore rules will reject them.

### Payload 1: Self-Elevation to Admin
An unauthenticated or standard user attempts to make themselves an admin.
- **Collection**: `/admins/malicious_user_id`
- **Payload**:
```json
{
  "email": "malicious@gmail.com",
  "assignedAt": "request.time",
  "assignedBy": "system"
}
```
- **Expectation**: `PERMISSION_DENIED` because the request is not authenticated as an existing admin.

### Payload 2: Admin Creation by Standard User
A logged-in non-admin user tries to write a new admin document.
- **Collection**: `/admins/some_new_id`
- **Payload**:
```json
{
  "email": "friend@gmail.com",
  "assignedAt": "request.time",
  "assignedBy": "malicious@gmail.com"
}
```
- **Expectation**: `PERMISSION_DENIED` since the writer is not in the `/admins` collection.

### Payload 3: Spoofing Owner ID in Booking
User A attempts to submit a booking claiming it belongs to User B.
- **Collection**: `/bookings/booking_123`
- **Payload**:
```json
{
  "fullName": "Sardor",
  "phone": "+998 (90) 123-45-67",
  "category": "Yotoqxona Mebellari",
  "message": "Nice mebel",
  "status": "yangi",
  "createdAt": "request.time",
  "updatedAt": "request.time",
  "userId": "victim_user_id_999"
}
```
- **Expectation**: `PERMISSION_DENIED` because `userId` must equal `request.auth.uid`.

### Payload 4: Arbitrary Status Changes in Booking
A standard user attempts to bypass booking pipeline to mark their booking as "yakunlandi" (completed) or "kelishildi" (approved).
- **Collection**: `/bookings/booking_123`
- **Payload**:
```json
{
  "status": "yakunlandi"
}
```
- **Expectation**: `PERMISSION_DENIED` because standard users can only set `status` to `yangi` on create, and cannot transition to other stages except `bekor_qilindi`.

### Payload 5: Poisoning Admin Note
A standard user tries to inject an administrative note on their booking.
- **Collection**: `/bookings/booking_123`
- **Payload**:
```json
{
  "adminNote": "Give this customer 90% discount, they are VIP"
}
```
- **Expectation**: `PERMISSION_DENIED` because `adminNote` is a system/admin-only field.

### Payload 6: Category Overwrite by Non-Admin
A guest user tries to delete or change the price/details of "yotoqxona" mebel category.
- **Collection**: `/categories/yotoqxona`
- **Payload**:
```json
{
  "title": "Super Cheap Yotoqxona",
  "details": "Hack attempt details description goes here"
}
```
- **Expectation**: `PERMISSION_DENIED` because only admins can write to `/categories`.

### Payload 7: Huge Payload Attack (Denial of Wallet)
A malicious user sends a booking with an extremely large message of 10MB to inflate storage costs.
- **Collection**: `/bookings/random_id`
- **Payload**:
```json
{
  "fullName": "Spammer",
  "phone": "+998901234567",
  "category": "Oshxona Mebellari",
  "message": "[10MB string...]",
  "status": "yangi",
  "createdAt": "request.time",
  "updatedAt": "request.time",
  "userId": "spammer_uid"
}
```
- **Expectation**: `PERMISSION_DENIED` because the string length check on `message` (e.g., `message.size() <= 1000`) is enforced in rules.

### Payload 8: Invalid Timestamp Spoofing
A user tries to set the booking `createdAt` field to a future date instead of server-time.
- **Collection**: `/bookings/booking_123`
- **Payload**:
```json
{
  "fullName": "Sardor",
  "phone": "+998901234567",
  "category": "Oshxona Mebellari",
  "status": "yangi",
  "createdAt": "timestamp_in_2030",
  "updatedAt": "timestamp_in_2030"
}
```
- **Expectation**: `PERMISSION_DENIED` because of the strict `request.time` server timestamp check.

### Payload 9: Anonymous User Reading Admin Collections
An anonymous user attempts to list the `/admins` collection or list other users' `/bookings`.
- **Collection**: `/admins` or `/bookings` (list queries)
- **Payload**: `getDocs(collection(db, 'admins'))`
- **Expectation**: `PERMISSION_DENIED` as only authenticated admins can query/read all admin and booking documents.

### Payload 10: Injecting Malicious Fields (Shadow Updates)
A user tries to update an existing booking by adding an unwhitelisted field `isPremiumUser: true`.
- **Collection**: `/bookings/booking_123`
- **Payload**:
```json
{
  "isPremiumUser": true
}
```
- **Expectation**: `PERMISSION_DENIED` because `affectedKeys().hasOnly(...)` prohibits fields outside of the verified list.

### Payload 11: Deleting Category Content
A guest user attempts to delete the `/settings/contact_info` document.
- **Collection**: `/settings/contact_info`
- **Action**: Delete
- **Expectation**: `PERMISSION_DENIED` since only admins can write/delete settings.

### Payload 12: Invalid ID Characters (Poison ID)
A user attempts to create a category with a huge or malformed document ID containing SQL injection style characters or 10KB string size.
- **Collection**: `/categories/` + malformed ID
- **Payload**: `{ "title": "Malformed ID Category" }`
- **Expectation**: `PERMISSION_DENIED` due to `isValidId(categoryId)` which enforces alphanumeric limits and max size.

---

## 3. The Test Runner Structure

The rules can be tested programmatically using `@firebase/rules-unit-testing`. The skeleton below outlines the test runner verifying these exact permissions.

```typescript
// firestore.rules.test.ts
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment 
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'astral-petal-479016-f7',
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8')
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Bek Mebeli Security Rules', () => {
  it('should reject non-admin users from promoting themselves to admin', async () => {
    const context = testEnv.authenticatedContext('malicious_uid');
    const db = context.firestore();
    const adminRef = doc(db, 'admins', 'malicious_uid');
    
    await expect(setDoc(adminRef, {
      email: 'malicious@gmail.com',
      assignedAt: new Date()
    })).rejects.toThrow();
  });

  it('should accept valid booking creation by customers', async () => {
    const context = testEnv.authenticatedContext('user_123');
    const db = context.firestore();
    const bookingRef = doc(db, 'bookings', 'new_booking');
    
    // Using mock date for server timestamp tests or using rule helpers
  });
});
```
