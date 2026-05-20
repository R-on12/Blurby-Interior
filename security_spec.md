# Security Specifications & Rules Audit

## Data Invariants
1. **Unidentified Access Prevention**: Only authenticated users with verified emails (`email_verified == true`) are permitted to book consultations, request inquiry responses, or write items.
2. **Admin Privilege Isolation**: Only administrators (identified by email `coopedill@gmail.com` with `email_verified == true` or listed in the `/admins` collection) may create, update, or delete projects, gallery images, blog posts, or designer profiles.
3. **Immutability of Key Metadata**: Fields such as `id` and `createdAt` must remain completely immutable after creation.
4. **Valid Resource Identification**: The `id` matches dynamic paths and conforms strictly to standard alphanumeric/hyphen identifiers with strict bounds check on lengths.
5. **No Blind Reads**: Client queries to inquiries, bookings, or designer listings should not do unconstrained list operations unless they are verified admins, or (for public bookings and inquiries) are constrained to user ownership where applicable.
6. **Value Range Enforcement**: All numerical and string bounds (such as name length, messages) must be guarded correctly to prevent Denial of Wallet string spam attacks.

---

## The "Dirty Dozen" Malicious Payloads

### 1. Project Invariant Abuse (Privilege Escalation)
* **Description**: A random user tries to create a Project without being an admin.
* **Payload**:
  ```json
  {
    "id": "new-proj-1",
    "title": "Hacked Suite",
    "category": "Modern",
    "img": "url-here",
    "createdAt": "2026-05-20T13:35:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 2. System Field Injection (Time Tampering)
* **Description**: Users setting arbitrary `createdAt` timestamps instead of server-verified time.
* **Payload**:
  ```json
  {
    "id": "new-proj-2",
    "title": "Future Project",
    "category": "Minimalist",
    "img": "url",
    "createdAt": "2030-12-31T23:59:59Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 3. State Bypass/Shortcutting in Booking
* **Description**: Setting the status of a newly created booking directly to "Confirmed" by bypass.
* **Payload**:
  ```json
  {
    "id": "booking-xyz",
    "clientName": "Attacker",
    "clientEmail": "attacker@spam.com",
    "space": "Luxury Lounge",
    "date": "2026-06-01",
    "status": "Confirmed",
    "createdAt": "2026-05-20T13:35:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED` (New bookings can only start as "Pending" or "Consultation" or must be written by authenticated clients in specific roles, or only editable by admins).

### 4. Immense String Resource Exhaustion / Denial of Wallet
* **Description**: Injecting a 5MB message body text into an inquiry.
* **Payload**:
  ```json
  {
    "id": "inq-huge",
    "clientName": "Attacker",
    "clientEmail": "attacker@spam.com",
    "subject": "Spam",
    "messageText": "A".repeat(5000000),
    "status": "active",
    "createdAt": "2026-05-20T13:35:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 5. Rogue Path Variable ID poisoning
* **Description**: Trying to save project with a path ID that does not match the inside `id` key.
* **Payload**:
  ```json
  {
    "id": "legit-id-123"
  }
  ```
  *(Written to path `/projects/malicious-poison-id-here`)*
* **Expected Result**: `PERMISSION_DENIED`

### 6. Email Spoofing Attack
* **Description**: Accessing resources with an unverified email claiming to be the manager, or creating a user with the admin's email and `email_verified = false`.
* **Payload**:
  *(Authentication context contains `email: "coopedill@gmail.com", email_verified: false`)*
  *(Operation: Write to `/designers/designer-1`)*
* **Expected Result**: `PERMISSION_DENIED`

### 7. Ghost Field Injection (Under-the-radar edit)
* **Description**: Updating a designer but slipping in an un-allowed field "salary" or "salaryRate".
* **Payload**:
  ```json
  {
    "name": "Elena Solst",
    "role": "Senior Stylist",
    "location": "Paris",
    "salary": 999999
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 8. Immutable Field Change during Update
* **Description**: Modification of a project's `createdAt` time during an update.
* **Payload**:
  ```json
  {
    "title": "Modern Oslo",
    "createdAt": "2020-01-01T00:00:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 9. Orphaned Booking (Bypassing relation/keys)
* **Description**: Creating a booking that lacks required email address.
* **Payload**:
  ```json
  {
    "id": "booking-bad",
    "clientName": "Bob",
    "space": "Lounge",
    "date": "2026-06-01",
    "status": "Pending",
    "createdAt": "2026-05-20T13:35:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 10. Malicious Terminal State Shift
* **Description**: Admin/worker trying to revert a confirmed booking to "Pending" once it has been processed, or changing an archived inquiry back to active without authorization, or bypassing validation constraints.
* **Payload**:
  *(From a customer account trying to alter status properties)*
* **Expected Result**: `PERMISSION_DENIED`

### 11. Unassigned Designer (Missing attributes)
* **Description**: Creating a designer record missing standard `location` or `role`.
* **Payload**:
  ```json
  {
    "id": "des-3",
    "name": "Jane Doe",
    "createdAt": "2026-05-20T13:35:00Z"
  }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### 12. Non-alphanumeric Document ID
* **Description**: Writing with random inject character ID strings (e.g. including paths or special symbols).
* **Payload**:
  `ID: "proj_###_bad_$$$"`
* **Expected Result**: `PERMISSION_DENIED`
