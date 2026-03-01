# PROJECT BRIEF - E-COMMERCE TOKO KUE

**Project Name:** Toko Kue Bu Siti - Online Store Platform  
**Client:** Bu Siti  
**Prepared By:** [Your Name/Company]  
**Date:** February 20, 2024  
**Version:** 1.0  
**Status:** Approved  

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Business Objectives](#business-objectives)
4. [Target Audience](#target-audience)
5. [Scope of Work - Phase 1](#scope-of-work---phase-1)
6. [Technical Architecture](#technical-architecture)
7. [Feature Specifications](#feature-specifications)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Design Requirements](#design-requirements)
10. [Integration Requirements](#integration-requirements)
11. [Timeline & Milestones](#timeline--milestones)
12. [Deliverables](#deliverables)
13. [Budget & Payment Terms](#budget--payment-terms)
14. [Assumptions & Constraints](#assumptions--constraints)
15. [Change Management](#change-management)
16. [Testing & Quality Assurance](#testing--quality-assurance)
17. [Training & Documentation](#training--documentation)
18. [Support & Maintenance](#support--maintenance)
19. [Success Criteria](#success-criteria)
20. [Appendix A: Phase 2 & 3 Scope](#appendix-a-phase-2--3-scope)
21. [Appendix B: Out of Scope](#appendix-b-out-of-scope)
22. [Sign-Off](#sign-off)

---

## 1. EXECUTIVE SUMMARY

### Project Description
Development of a comprehensive e-commerce platform for Toko Kue Bu Siti, enabling online product catalog, order management, content publishing, and administrative capabilities. The platform will serve as the primary digital sales channel for the business.

### Key Highlights
- **Platform Type:** Full-stack web application with CMS capabilities
- **Technology:** Modern web technologies (Next.js, Payload CMS, PostgreSQL)
- **Deployment:** Cloudflare Pages (frontend) + Railway (backend)
- **Timeline:** 6 weeks from kickoff to launch
- **Budget:** Rp 20,000,000 (Phase 1)

### Business Value
- Expand market reach through online presence
- Streamline order management process
- Reduce manual administrative workload
- Enable 24/7 sales capability
- Build customer database and insights
- Establish digital brand presence

---

## 2. PROJECT OVERVIEW

### 2.1 Background
Toko Kue Bu Siti is an established local bakery seeking to expand its business into the digital marketplace. The current sales process relies on manual orders via WhatsApp and phone calls, limiting scalability and customer convenience.

### 2.2 Problem Statement
- Limited reach to potential customers beyond local area
- Manual order processing is time-consuming and error-prone
- No centralized product catalog or inventory management
- Difficulty in managing customer relationships and repeat orders
- No platform for marketing content and recipe sharing
- Inability to track sales analytics and business metrics

### 2.3 Proposed Solution
A custom-built e-commerce platform that provides:
- Professional online storefront with product catalog
- Automated order management system
- Self-service admin panel for content management
- Integrated notification system (WhatsApp & Email)
- Blog/article publishing capabilities
- Basic business analytics and reporting

---

## 3. BUSINESS OBJECTIVES

### 3.1 Primary Objectives
1. **Increase Revenue:** Target 30% revenue increase in 6 months post-launch
2. **Operational Efficiency:** Reduce order processing time by 70%
3. **Market Expansion:** Reach customers beyond 50km radius
4. **Customer Data:** Build customer database of 500+ contacts in 3 months
5. **Brand Awareness:** Establish digital brand presence with 1000+ monthly visitors

### 3.2 Secondary Objectives
1. Enable content marketing through blog/recipe sharing
2. Reduce customer service workload through self-service features
3. Gather customer insights through order data analytics
4. Build foundation for future features (member system, loyalty program)

---

## 4. TARGET AUDIENCE

### 4.1 Primary Users

**Customers (End Users)**
- Demographics: Women & men, 25-55 years old
- Socioeconomic: Middle to upper-middle class
- Behavior: Comfortable with online shopping
- Use Cases: Personal consumption, gifts, events, corporate orders
- Technical Level: Basic to intermediate smartphone/computer usage

**Admin Users (Bu Siti & Team)**
- Demographics: Business owners and staff
- Technical Level: Low to medium (non-technical)
- Responsibilities: Product management, order processing, content creation
- Requirements: Simple, intuitive admin interface with minimal training

### 4.2 User Personas

**Persona 1: Ibu Rumah Tangga (Primary Customer)**
- Age: 35-45
- Needs: Quick ordering, clear product info, reliable delivery
- Pain Points: Limited time, needs convenience
- Goals: Find quality cakes for family events

**Persona 2: Corporate Buyer (Secondary Customer)**
- Age: 28-40
- Needs: Bulk orders, invoicing, reliable quality
- Pain Points: Coordination with team, budget approval
- Goals: Hassle-free corporate gifting/events

**Persona 3: Bu Siti (Admin User)**
- Age: 45
- Needs: Simple product management, clear order notifications
- Pain Points: Not tech-savvy, limited time
- Goals: Manage business efficiently without technical complexity

---

## 5. SCOPE OF WORK - PHASE 1

### 5.1 Phase 1 Core Features (MVP)

This phase focuses on essential e-commerce functionality with self-management capabilities.

#### ✅ Included in Phase 1:

**5.1.1 Public Website (Frontend)**
- Homepage with featured products and hero slider
- Product catalog with search, filter, and sort
- Product detail pages with image galleries
- Product variant selection (size, flavor, price)
- Shopping cart with quantity adjustment
- Checkout process with customer form
- Order confirmation page
- Order tracking page (customer checks status)
- Blog/article listing and detail pages
- About page, Contact page, Terms & Privacy
- Instagram feed integration
- Floating WhatsApp button
- Mobile responsive design
- SEO optimization (meta tags, sitemap)

**5.1.2 Admin Panel (CMS)**
- Dashboard with key metrics
- Product management (CRUD operations)
  - Product details (name, description, SKU)
  - Product variants (flavor, size, price, stock)
  - Image upload (multiple images per product)
  - Category assignment
  - Product status (Available, Sold Out, Pre-Order)
  - Featured product toggle
  - SEO settings per product
- Order management
  - Order list with filters and search
  - Order detail view
  - Order status management (5 statuses)
  - Payment proof review
  - Customer information view
  - Order notes
  - Print invoice
- Blog/Article management
  - Article CRUD with rich text editor
  - Image upload for articles
  - Category management
  - Publish/draft status
  - Featured article toggle
  - SEO settings per article
- Category management (products & blog)
- Media library (uploaded images)
- Site settings
  - General info (name, contact, address)
  - WhatsApp number configuration
  - WhatsApp button toggle (on/off)
  - Shipping cost settings
  - Instagram feed URL
  - Logo & favicon upload

**5.1.3 Order System**
- Shopping cart functionality
- Checkout form with validation
- Order number generation (unique)
- Payment proof upload
- Dummy payment gateway (auto-success for testing)
- Order status workflow:
  1. Pending Payment
  2. Confirmed
  3. Baking
  4. Ready for Pickup/Delivery
  5. Delivered
- Order history for customers (via order number)

**5.1.4 Notification System**
- WhatsApp notifications (via API)
  - New order notification to admin
  - Order confirmation to customer
  - Status update notifications
- Email notifications
  - Order confirmation with details
  - Status update emails
  - Order invoice (PDF)
- Configurable notification templates

**5.1.5 Basic Analytics**
- Total orders (today, this month)
- Total revenue (today, this month)
- Orders by status (pie chart)
- Top 5 selling products
- Recent orders list
- Low stock alerts (< 5 items)

**5.1.6 Content Management**
- Rich text editor for descriptions
- Image optimization and resizing
- SEO management (title, description, keywords)
- URL slug customization

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

**Frontend**
```yaml
Framework: Next.js 15 (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: Shadcn/UI
State Management: React Context + Zustand
Form Handling: React Hook Form + Zod validation
Image Optimization: Next/Image + Cloudflare CDN
Deployment: Cloudflare Pages
```

**Backend (CMS)**
```yaml
CMS Framework: Payload CMS 3.x
Runtime: Node.js 20.x
Language: TypeScript
API: REST API (auto-generated by Payload)
Authentication: JWT-based (Payload built-in)
File Upload: Local storage / Cloudflare R2
Deployment: Railway
```

**Database**
```yaml
Database: PostgreSQL 15
ORM: Prisma (via Payload)
Hosting: Railway managed PostgreSQL
Backup: Automatic daily backups
```

**External Services**
```yaml
WhatsApp API: Fonnte.com
Email Service: Resend.com
Image CDN: Cloudflare CDN
File Storage: Cloudflare R2 (optional) or Railway volume
Analytics: Google Analytics 4 (optional)
Error Tracking: Sentry (optional)
```

### 6.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Frontend)                    │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Homepage  │  │  Products  │  │    Cart    │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │    Blog    │  │  Checkout  │  │  Tracking  │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ API Calls (REST)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│               RAILWAY (Backend - Payload CMS)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PAYLOAD CMS APPLICATION                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Admin    │  │  REST API  │  │   Auth     │     │  │
│  │  │    UI      │  │  Endpoint  │  │  (JWT)     │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                                │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ↓
         ┌────────────────────────────────────┐
         │    POSTGRESQL DATABASE (Railway)    │
         │  ┌───────┐  ┌──────┐  ┌─────────┐ │
         │  │Products│  │Orders│  │  Users  │ │
         │  └───────┘  └──────┘  └─────────┘ │
         │  ┌───────┐  ┌──────┐  ┌─────────┐ │
         │  │  Blog │  │ Media│  │Categories│ │
         │  └───────┘  └──────┘  └─────────┘ │
         └────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  WhatsApp   │  │    Email    │  │   Storage   │         │
│  │   (Fonnte)  │  │  (Resend)   │  │ (CF R2/Vol) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Data Flow

**User Makes Order:**
```
1. Customer browses products (CF Pages)
2. Adds to cart (Local Storage)
3. Fills checkout form (CF Pages)
4. Submits order → POST /api/orders (Railway)
5. Payload creates order in PostgreSQL
6. Webhook triggers notifications
7. WhatsApp & Email sent to customer & admin
8. Order confirmation page shown
```

**Admin Updates Order Status:**
```
1. Admin logs in (Railway)
2. Views order in Payload admin
3. Changes status field
4. Saves order
5. Webhook triggers on status change
6. Notification sent to customer
7. Timeline updated in database
```

### 6.4 Security Measures

**Frontend Security:**
- HTTPS only (enforced by Cloudflare)
- Content Security Policy (CSP) headers
- XSS protection via React/Next.js defaults
- Input validation on client side
- No sensitive data in localStorage
- Environment variables for API endpoints

**Backend Security:**
- JWT authentication for admin panel
- Password hashing (bcrypt)
- Input sanitization (Payload built-in)
- SQL injection protection (Prisma ORM)
- Rate limiting on API endpoints
- CORS configuration (whitelist frontend domain)
- File upload validation (type, size)
- Secure session management

**Database Security:**
- Encrypted connections (SSL)
- Regular automated backups
- No direct public access
- Strong password policy
- Principle of least privilege

**API Security:**
- API key authentication for external services
- Webhook signature verification
- Request validation (Zod schemas)
- Error handling without sensitive info leakage

### 6.5 Performance Optimization

**Frontend:**
- Static site generation (SSG) for product pages
- Incremental static regeneration (ISR) for updates
- Image optimization (WebP, lazy loading)
- Code splitting and tree shaking
- Cloudflare CDN caching
- Prefetching critical resources

**Backend:**
- Database query optimization
- Response caching where applicable
- Efficient database indexes
- Pagination for large datasets
- Compression (gzip/brotli)

**Target Metrics:**
- Lighthouse Performance: >90
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- Cumulative Layout Shift (CLS): <0.1

---

## 7. FEATURE SPECIFICATIONS

### 7.1 Product Management

**7.1.1 Product Entity**
```typescript
Product {
  id: string (UUID)
  name: string (required, max 200 chars)
  slug: string (unique, auto-generated from name)
  description: richText (required)
  sku: string (optional, unique)
  
  // Images
  images: Image[] (1-5 images, first is primary)
  
  // Categorization
  category: Category (required, relationship)
  tags: string[] (optional)
  
  // Variants
  variants: ProductVariant[] (required, min 1)
  
  // Status
  status: enum (Available, SoldOut, PreOrder)
  featured: boolean (default false)
  
  // Tracking
  totalSold: number (default 0, auto-increment)
  views: number (default 0)
  
  // SEO
  metaTitle: string (optional, max 60)
  metaDescription: string (optional, max 160)
  
  // Timestamps
  createdAt: datetime
  updatedAt: datetime
  publishedAt: datetime (nullable)
}

ProductVariant {
  id: string
  name: string (e.g., "Cokelat", "Vanilla")
  size: enum (Small, Medium, Large)
  price: number (required, min 0)
  stock: number (required, min 0, default 0)
  sku: string (optional, unique)
  isAvailable: boolean (computed from stock > 0)
}

Image {
  id: string
  url: string
  alt: string
  width: number
  height: number
  size: number (bytes)
  mimeType: string
}

Category {
  id: string
  name: string (unique)
  slug: string (unique)
  description: text (optional)
  image: Image (optional)
  productsCount: number (computed)
}
```

**7.1.2 Product Admin Features**

**Create/Edit Product:**
- Form with validation
- Rich text editor for description (with image upload)
- Drag-and-drop image upload (with preview)
- Image reordering (drag & drop)
- Variant management:
  - Add/remove variants dynamically
  - Duplicate variant for quick entry
  - Bulk stock update
- Category selector (dropdown or searchable)
- Tag input (auto-complete)
- Status toggle (radio buttons)
- Featured toggle (checkbox)
- SEO fields (collapsible section)
- Preview button (opens product page in new tab)
- Save draft / Publish options

**Product List:**
- Table view with columns:
  - Thumbnail (primary image)
  - Name
  - Category
  - Total variants
  - Stock (sum of all variants)
  - Status
  - Featured
  - Total sold
  - Actions (Edit, Duplicate, Delete)
- Filters:
  - By category
  - By status
  - Featured only
  - Low stock (< 5)
- Search: By name or SKU
- Sort: By name, created date, total sold, stock
- Bulk actions:
  - Change status
  - Delete multiple
  - Export to CSV
- Pagination: 20 items per page
- Quick actions:
  - Quick stock update modal
  - Quick status change dropdown

**Stock Management:**
- Real-time stock updates
- Stock adjustment log (history)
- Low stock alerts (configurable threshold)
- Out of stock auto-change status
- Bulk stock import (CSV)

**7.1.3 Product Display (Frontend)**

**Product Catalog Page:**
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Product card shows:
  - Primary image (hover for secondary image)
  - Name
  - Starting price (from lowest variant)
  - Category badge
  - Status badge (if Sold Out or Pre-Order)
  - Featured badge (if featured)
  - Rating (if Phase 2 implemented)
- Filters sidebar:
  - Category checkboxes
  - Price range slider
  - Status filters
  - Sort dropdown (newest, popular, price low-high, price high-low)
- Search bar with suggestions
- Pagination or infinite scroll
- Empty state (if no products)
- Loading skeleton

**Product Detail Page:**
- Breadcrumb navigation
- Image gallery:
  - Main image display (zoom on hover)
  - Thumbnail carousel
  - Fullscreen lightbox on click
- Product information:
  - Name (H1)
  - Category link
  - Short description
  - Variant selector:
    - Size buttons (radio)
    - Flavor dropdown
    - Price updates dynamically
    - Stock indicator (X items left)
  - Quantity selector (+ / -)
  - Add to Cart button (disabled if out of stock)
  - Add to Wishlist button (Phase 2)
  - Share buttons (WhatsApp, Facebook, Twitter, Copy link)
- Product details tabs:
  - Description (full rich text)
  - Ingredients (if specified)
  - Allergen information (if specified)
  - Delivery information
- Related products carousel (same category)
- Recently viewed products (if browsing history exists)

---

### 7.2 Shopping Cart & Checkout

**7.2.1 Shopping Cart**

**Cart Entity:**
```typescript
CartItem {
  id: string
  product: Product (relationship)
  variant: ProductVariant (relationship)
  quantity: number (min 1, max stock)
  price: number (snapshot of variant price)
  subtotal: number (computed: price * quantity)
}

Cart {
  items: CartItem[]
  subtotal: number (computed: sum of item subtotals)
  shipping: number (default from settings)
  total: number (computed: subtotal + shipping)
  itemCount: number (computed: sum of quantities)
}
```

**Cart Features:**
- Persistent cart (localStorage for guests)
- Cart icon in header with item count badge
- Cart drawer/modal:
  - List of cart items
  - Thumbnail, name, variant, quantity, price
  - Quantity adjustment (+ / -)
  - Remove item (X button)
  - Subtotal
  - Continue shopping button
  - Checkout button
- Cart page (full view):
  - Same as drawer but full page layout
  - Promo code input (Phase 2)
  - Shipping cost display
  - Total calculation
- Empty cart state (with CTA to browse products)
- Max quantity validation (cannot exceed stock)
- Out of stock handling (auto-remove or notify)
- Cart expiry (optional, 24 hours)

**7.2.2 Checkout Process**

**Checkout Form:**
```typescript
CheckoutForm {
  // Customer Info
  fullName: string (required, max 100)
  email: string (required, email validation)
  phone: string (required, phone validation)
  
  // Delivery
  address: text (required, max 500)
  city: string (required)
  postalCode: string (optional)
  deliveryNotes: text (optional, max 200)
  
  // Order
  orderType: enum (Delivery, Pickup) (required)
  deliveryDate: date (required, min: today + 2 days)
  deliveryTime: enum (Morning 9-12, Afternoon 13-17, Evening 18-21)
  
  // Payment
  paymentProof: file (optional, uploaded after order created)
  
  // Agreement
  agreeTerms: boolean (required, must be true)
}
```

**Checkout Flow:**
1. Cart review (summary of items)
2. Customer information form
3. Delivery details form
4. Order summary review
5. Payment instructions
6. Submit order
7. Order confirmation page
8. Payment proof upload (optional, can be done later)

**Checkout Features:**
- Step indicator (progress bar)
- Form validation (client & server side)
- Auto-save form data (localStorage)
- Back to cart button (preserves cart)
- Edit cart during checkout (return to cart)
- Delivery date picker (block past dates, sundays closed)
- Delivery time slot selection
- Payment instruction modal/page:
  - Bank account details
  - Payment amount (exact total)
  - Order number reference
  - Upload proof instructions
- Order confirmation page:
  - Order number (prominent)
  - Order summary
  - Total paid
  - Delivery details
  - Estimated completion time
  - Track order button
  - WhatsApp contact button
  - Download invoice (PDF)
- Automatic email & WhatsApp sent

**7.2.3 Payment (Dummy for Phase 1)**

**Dummy Payment Flow:**
```
1. User submits order
2. System generates order with "Pending Payment" status
3. Payment instruction page shown
4. User can:
   a. Upload payment proof via order page
   b. Or skip and upload later via tracking link
5. For testing: "Auto-confirm" button available
   - Automatically changes status to "Confirmed"
   - Simulates payment verification
```

**Payment Proof Upload:**
- Order tracking page has upload section
- Upload image (JPG/PNG, max 5MB)
- Preview before submit
- Replace uploaded proof (if wrong)
- Admin receives notification when proof uploaded
- Admin can view proof in order detail
- Admin manually confirms payment

**Future Payment Gateway (Out of Scope Phase 1):**
- Midtrans integration
- Xendit integration
- Bank transfer (auto-verification)
- E-wallet (GoPay, OVO, DANA)
- Credit card

---

### 7.3 Order Management

**7.3.1 Order Entity**

```typescript
Order {
  id: string (UUID)
  orderNumber: string (unique, auto-generated: TK-YYYYMMDD-XXX)
  
  // Customer
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  
  // Items
  items: OrderItem[]
  
  // Pricing
  subtotal: number
  shipping: number
  discount: number (default 0, Phase 2)
  total: number
  
  // Delivery
  orderType: enum (Delivery, Pickup)
  deliveryDate: date
  deliveryTime: string
  deliveryNotes: text
  
  // Payment
  paymentMethod: string (default "Bank Transfer")
  paymentProof: Image (nullable)
  paymentStatus: enum (Unpaid, Paid, Refunded)
  
  // Status
  status: enum (Pending, Confirmed, Baking, Ready, Delivered, Cancelled)
  statusHistory: StatusChange[] (timeline)
  
  // Notes
  adminNotes: text (internal, not visible to customer)
  customerNotes: text (from deliveryNotes)
  
  // Timestamps
  createdAt: datetime
  updatedAt: datetime
  confirmedAt: datetime (nullable)
  completedAt: datetime (nullable)
  cancelledAt: datetime (nullable)
}

OrderItem {
  id: string
  product: Product (relationship, snapshot)
  productName: string (snapshot)
  variantName: string (snapshot)
  variantSize: string (snapshot)
  quantity: number
  pricePerItem: number (snapshot)
  subtotal: number (computed)
}

StatusChange {
  status: string
  changedBy: User
  changedAt: datetime
  notes: string (optional)
}
```

**7.3.2 Order Status Workflow**

```
┌─────────────┐
│   Pending   │ ← Order created, awaiting payment
└──────┬──────┘
       │ Admin confirms payment
       ↓
┌─────────────┐
│  Confirmed  │ ← Payment verified, order accepted
└──────┬──────┘
       │ Admin starts production
       ↓
┌─────────────┐
│   Baking    │ ← Cake is being made
└──────┬──────┘
       │ Production complete
       ↓
┌─────────────┐
│    Ready    │ ← Ready for pickup/delivery
└──────┬──────┘
       │ Handed over to customer
       ↓
┌─────────────┐
│  Delivered  │ ← Order complete
└─────────────┘

       OR
       
┌─────────────┐
│  Cancelled  │ ← Order cancelled (any stage before Delivered)
└─────────────┘
```

**Status Descriptions:**
1. **Pending Payment**: Order created, waiting for payment verification
2. **Confirmed**: Payment verified, order accepted into production queue
3. **Baking**: Currently being prepared/baked
4. **Ready**: Completed and ready for pickup or delivery
5. **Delivered**: Successfully delivered/picked up, order complete
6. **Cancelled**: Order cancelled (by admin or customer request)

**7.3.3 Admin Order Management**

**Order List Page:**
- Table view with columns:
  - Order Number (clickable)
  - Customer Name
  - Items (count)
  - Total
  - Status (colored badge)
  - Payment Status (badge)
  - Delivery Date
  - Created Date
  - Actions (View, Edit Status, Print)
- Filters:
  - By status (dropdown multi-select)
  - By payment status
  - By date range (date picker)
  - By order type (Delivery/Pickup)
  - By delivery date
- Search: By order number, customer name, phone, email
- Sort: By date, total, status
- Bulk actions:
  - Change status (batch)
  - Export to CSV/Excel
  - Print invoices (batch)
- Pagination: 25 orders per page
- Stats cards at top:
  - Today's orders count
  - Today's revenue
  - Pending payment count (alert badge)
  - Orders to prepare today

**Order Detail Page:**
- Header section:
  - Order number (large, prominent)
  - Status badge (large)
  - Created date & time
  - Action buttons (Print Invoice, Cancel Order, Mark as Delivered)
- Customer information card:
  - Name, Email, Phone (clickable to call/email)
  - Full address
  - Map preview (if address has coordinates)
- Order items table:
  - Product name (with thumbnail)
  - Variant details
  - Quantity
  - Unit price
  - Subtotal
  - Total items count
- Pricing breakdown:
  - Subtotal
  - Shipping cost
  - Discount (if any, Phase 2)
  - Total (bold, large)
- Delivery information:
  - Order type (Delivery/Pickup)
  - Delivery date & time slot
  - Customer notes
- Payment information:
  - Payment method
  - Payment status badge
  - Payment proof image (if uploaded, with lightbox)
  - Confirm payment button (if pending)
- Status timeline:
  - Visual timeline/stepper
  - Each status with timestamp
  - User who changed status
  - Notes for each change
- Status update section:
  - Dropdown to select new status
  - Notes textarea (optional, for internal use)
  - Update button
  - Automatic notification toggle (send WhatsApp/email)
- Admin notes section:
  - Internal notes textarea
  - Not visible to customer
  - Save notes button
- Activity log:
  - All changes to order (who, when, what)
  - Payment proof uploads
  - Status changes
  - Admin note additions

**Quick Actions:**
- Print invoice → Generate PDF invoice
- Send WhatsApp → Compose pre-filled message
- Send Email → Compose order email
- Copy order → Duplicate order (for repeat customers)
- Refund (Phase 2+)

**7.3.4 Customer Order Tracking**

**Tracking Page (Public, No Login):**
- URL: `/track-order` or `/orders/[orderNumber]`
- Form to enter order number & email (verification)
- Submit → Show order details

**Order Tracking View:**
- Order summary (read-only):
  - Order number
  - Status badge
  - Items list
  - Total
  - Delivery date
- Status timeline (visual progress):
  - Shows completed steps in green
  - Current step highlighted
  - Future steps grayed out
  - Each step with timestamp
- Payment section:
  - If Pending: Upload payment proof button
  - If Paid: Payment confirmed checkmark
- Delivery information
- Contact us section:
  - WhatsApp button (direct link)
  - Email support link
  - Phone number
- Print invoice button
- No edit capability (read-only)

**Payment Proof Upload (Customer):**
- Modal/section in tracking page
- File input (image only, max 5MB)
- Preview before submit
- Submit button
- Success message after upload
- Automatic notification to admin

---

### 7.4 Blog & Content Management

**7.4.1 Blog Post Entity**

```typescript
BlogPost {
  id: string
  title: string (required, max 200)
  slug: string (unique, auto-generated)
  excerpt: text (optional, max 300, for list view)
  content: richText (required)
  
  // Media
  featuredImage: Image (required)
  
  // Categorization
  category: BlogCategory (required)
  tags: string[] (optional)
  
  // Author
  author: User (relationship, default: logged in user)
  
  // Status
  status: enum (Draft, Published)
  featured: boolean (default false)
  
  // SEO
  metaTitle: string (optional)
  metaDescription: string (optional)
  
  // Stats
  views: number (default 0)
  
  // Timestamps
  createdAt: datetime
  updatedAt: datetime
  publishedAt: datetime (nullable)
}

BlogCategory {
  id: string
  name: string (unique)
  slug: string (unique)
  description: text (optional)
  postsCount: number (computed)
}
```

**7.4.2 Blog Admin Features**

**Create/Edit Post:**
- Title input
- Slug input (auto-generated, editable)
- Rich text editor (full WYSIWYG):
  - Text formatting (bold, italic, underline, strikethrough)
  - Headings (H2, H3, H4)
  - Lists (ordered, unordered)
  - Links (with URL input)
  - Images (inline upload)
  - Blockquotes
  - Code blocks (for recipes)
  - Tables
  - Alignment (left, center, right)
  - Undo/redo
- Excerpt textarea (optional, for previews)
- Featured image upload (with crop tool)
- Category selector
- Tags input (comma-separated, auto-complete)
- Featured toggle
- SEO section (collapsible):
  - Meta title (with character counter)
  - Meta description (with character counter)
  - Preview snippet (Google-like)
- Status selector (Draft/Published)
- Publish date/time picker (schedule publishing, Phase 2)
- Preview button (opens in new tab)
- Save draft / Publish buttons

**Blog List:**
- Table view:
  - Featured image thumbnail
  - Title
  - Category
  - Status
  - Author
  - Published date
  - Views
  - Actions (Edit, Duplicate, Delete)
- Filters:
  - By category
  - By status
  - By author
  - Featured only
- Search: By title or content
- Sort: By date, views, title
- Bulk actions:
  - Change status
  - Delete multiple
  - Export to CSV
- Pagination: 20 posts per page

**7.4.3 Blog Frontend**

**Blog List Page:**
- Grid layout (2 columns desktop, 1 mobile)
- Post card shows:
  - Featured image (clickable)
  - Category badge
  - Title (H2, clickable)
  - Excerpt (truncated to 150 chars)
  - Author name & date
  - Read more link
- Featured posts section (carousel, top of page)
- Category filter sidebar
- Search bar
- Sort dropdown (newest, popular, oldest)
- Pagination or load more

**Blog Detail Page:**
- Breadcrumb navigation
- Featured image (full width)
- Category badge
- Title (H1)
- Author info & published date
- Share buttons (WhatsApp, Facebook, Twitter, Copy)
- Table of contents (auto-generated from headings, sticky sidebar)
- Article content (rich text rendered)
- Related posts (same category, carousel)
- CTA section (e.g., "Browse our products")

**Blog Category Page:**
- List of posts in that category
- Category name & description (H1)
- Similar to blog list layout

---

### 7.5 Notification System

**7.5.1 WhatsApp Notifications (via Fonnte API)**

**To Admin (Bu Siti):**

**New Order:**
```
🎂 *PESANAN BARU!*

*Order:* #TK-20240220-001
*Customer:* Ibu Ani
*Total:* Rp 350.000

*Items:*
- Brownies Cokelat (Medium) x2
- Lapis Legit (Large) x1

*Delivery:* 25 Feb 2024, Sore (13-17)

📋 Lihat detail: [link]
```

**Payment Proof Uploaded:**
```
💰 *BUKTI TRANSFER DITERIMA*

*Order:* #TK-20240220-001
*Customer:* Ibu Ani

Silakan verifikasi pembayaran.

📋 Lihat bukti: [link]
```

**To Customer:**

**Order Confirmation:**
```
✅ *PESANAN BERHASIL DIBUAT*

Terima kasih sudah memesan di Toko Kue Bu Siti!

*Nomor Order:* #TK-20240220-001
*Total:* Rp 350.000

*Delivery:* 25 Feb 2024, Sore (13-17)

📋 Lihat detail & lacak pesanan:
[tracking link]

💵 *CARA PEMBAYARAN:*
Transfer ke:
Bank BCA
1234567890
a.n. Siti Aminah

Nominal: Rp 350.000
Wajib upload bukti transfer!

Ada pertanyaan? Chat kami:
[WhatsApp link]
```

**Status Update (Confirmed):**
```
🎉 *PEMBAYARAN TERKONFIRMASI*

*Order:* #TK-20240220-001

Pembayaran Anda sudah diterima!
Kami akan segera memproses pesanan Anda.

Status: Confirmed ✅

📋 Lacak pesanan: [link]
```

**Status Update (Baking):**
```
👩‍🍳 *PESANAN SEDANG DIBUAT*

*Order:* #TK-20240220-001

Kue Anda sedang kami kerjakan dengan penuh kasih sayang! 💕

Status: Baking 🍰

📋 Lacak pesanan: [link]
```

**Status Update (Ready):**
```
✨ *PESANAN SUDAH SIAP!*

*Order:* #TK-20240220-001

Kue Anda sudah jadi dan siap diambil/dikirim!

📦 Pengiriman: Besok, 25 Feb 2024
🕐 Jam: Sore (13-17)

Status: Ready ✅

📋 Lacak pesanan: [link]
```

**Status Update (Delivered):**
```
🎉 *PESANAN TELAH SAMPAI*

*Order:* #TK-20240220-001

Terima kasih sudah berbelanja di Toko Kue Bu Siti!

Selamat menikmati kue nya! 🎂❤️

📝 Kami akan sangat menghargai review dari Anda! (Phase 2)

---
Pesan lagi: [website link]
```

**7.5.2 Email Notifications (via Resend)**

**Email Templates (HTML, responsive):**

**Order Confirmation Email:**
```
Subject: Pesanan Anda #TK-20240220-001 - Toko Kue Bu Siti

[Header with logo]

Halo Ibu Ani,

Terima kasih sudah memesan di Toko Kue Bu Siti!

╔═══════════════════════════════════════╗
║  DETAIL PESANAN                       ║
╠═══════════════════════════════════════╣
║  Nomor Order: #TK-20240220-001        ║
║  Tanggal: 20 Feb 2024                 ║
║  Status: Pending Payment              ║
╚═══════════════════════════════════════╝

ITEMS:
─────────────────────────────────────
Brownies Cokelat (Medium) x2
@ Rp 150.000                Rp 300.000

Lapis Legit (Large) x1
@ Rp 250.000                Rp 250.000
─────────────────────────────────────
Subtotal                    Rp 550.000
Ongkir                      Rp  20.000
─────────────────────────────────────
TOTAL                       Rp 570.000
═════════════════════════════════════

DELIVERY INFO:
Alamat: Jl. Merdeka No. 123, Jakarta
Tanggal: 25 Feb 2024
Waktu: Sore (13-17)

CARA PEMBAYARAN:
Transfer ke:
Bank BCA
1234567890
a.n. Siti Aminah

Jumlah: Rp 570.000

⚠️ PENTING: Upload bukti transfer melalui link tracking!

[Button: UPLOAD BUKTI TRANSFER]
[Button: LACAK PESANAN]

Ada pertanyaan?
WhatsApp: 0812-xxxx-xxxx
Email: hello@tokokuebusiti.com

Terima kasih,
Toko Kue Bu Siti

[Footer]
```

**Status Update Emails:** (similar structure, adjust content)

**Invoice PDF Attachment:**
- Professional invoice template
- Company logo & info
- Order details table
- Pricing breakdown
- Payment info
- Terms & conditions

**7.5.3 Notification Settings (Admin)**

**Admin Panel > Settings > Notifications:**
- Enable/disable WhatsApp notifications
- Enable/disable email notifications
- Choose which events trigger notifications:
  - [ ] New order
  - [ ] Payment proof uploaded
  - [ ] Status changes
  - [ ] Low stock alerts
- WhatsApp API configuration:
  - API key input
  - Phone number input
  - Test notification button
- Email configuration:
  - API key input
  - From email address
  - From name
  - Test email button
- Notification templates (editable):
  - WhatsApp message templates
  - Email subject & body templates
  - Variables available: {{orderNumber}}, {{customerName}}, etc.

---

### 7.6 Site Settings & Configuration

**7.6.1 General Settings**

**Admin Panel > Settings > General:**
- Site Information:
  - Site name (string)
  - Tagline (string)
  - Description (textarea)
  - Logo upload (image, max 2MB)
  - Favicon upload (ico/png, 32x32)
- Contact Information:
  - Email address
  - Phone number (WhatsApp)
  - Address (full)
  - Google Maps embed URL (optional)
- Social Media:
  - Instagram URL
  - Facebook URL (optional)
  - TikTok URL (optional)
- Business Hours:
  - Opening hours (text or structured)
  - Days closed (checkboxes)
- WhatsApp Settings:
  - WhatsApp number (with country code)
  - Enable floating button (toggle)
  - Button position (bottom-right, bottom-left)
  - Welcome message (default chat message)

**7.6.2 Shipping Settings**

- Default shipping cost (number)
- Free shipping threshold (optional, Phase 2)
- Shipping zones with different costs (Phase 2)
- Estimated delivery time (text)

**7.6.3 Order Settings**

- Minimum order amount (optional)
- Order prefix (e.g., "TK-")
- Default order status
- Auto-cancel unpaid orders after X days (optional)
- Available delivery time slots:
  - Morning (9:00 - 12:00)
  - Afternoon (13:00 - 17:00)
  - Evening (18:00 - 21:00)
  - Custom slots (Phase 2)
- Closed days (no delivery):
  - Sunday (checkbox)
  - Public holidays (Phase 2)
- Lead time (minimum days before delivery, default 2)

**7.6.4 Payment Settings**

- Bank accounts for transfer:
  - Bank name
  - Account number
  - Account holder name
  - Add multiple accounts
- Payment instructions (rich text)

**7.6.5 SEO Settings**

- Default meta title
- Default meta description
- Default social media image (og:image)
- Google Analytics ID (optional)
- Facebook Pixel ID (optional)
- Google Site Verification code
- Sitemap settings

**7.6.6 Email Settings**

- SMTP configuration (or use Resend)
- From email address
- From name
- Email templates (editable HTML)

**7.6.7 Advanced Settings**

- Maintenance mode (toggle)
- Custom CSS (textarea, inject into site)
- Custom scripts (header & footer)
- Robots.txt (textarea)
- Cookie consent settings
- GDPR compliance settings (Phase 2)

---

## 8. USER ROLES & PERMISSIONS

### 8.1 User Roles

**Phase 1 Roles:**

**Super Admin (Bu Siti)**
- Full access to everything
- Can create/edit/delete all content
- Can manage other users
- Can change settings
- Can view analytics

**Admin (Limited) - Phase 2**
- Can manage products
- Can manage orders
- Cannot change settings
- Cannot manage users

**Staff (View Only) - Phase 2**
- Can view orders
- Can update order status
- Cannot edit products
- Cannot access settings

### 8.2 Permission Matrix

| Feature                  | Super Admin | Admin | Staff |
|--------------------------|-------------|-------|-------|
| Dashboard                | ✅          | ✅    | ✅    |
| Products - View          | ✅          | ✅    | ❌    |
| Products - Create/Edit   | ✅          | ✅    | ❌    |
| Products - Delete        | ✅          | ❌    | ❌    |
| Orders - View            | ✅          | ✅    | ✅    |
| Orders - Update Status   | ✅          | ✅    | ✅    |
| Orders - Delete          | ✅          | ❌    | ❌    |
| Blog - View              | ✅          | ✅    | ❌    |
| Blog - Create/Edit       | ✅          | ✅    | ❌    |
| Categories               | ✅          | ✅    | ❌    |
| Media Library            | ✅          | ✅    | ❌    |
| Analytics                | ✅          | ✅    | ❌    |
| Settings                 | ✅          | ❌    | ❌    |
| Users Management         | ✅          | ❌    | ❌    |

---

## 9. DESIGN REQUIREMENTS

### 9.1 Design Direction

**Brand Identity:**
- Warm, friendly, homemade feel
- Professional yet approachable
- Clean and modern
- Color palette:
  - Primary: Warm pink/rose (#FF6B9D or similar)
  - Secondary: Cream/beige (#FFF8E7)
  - Accent: Brown/chocolate (#8B4513)
  - Neutrals: White, light gray, dark gray
- Typography:
  - Headings: Playfair Display or Cormorant (elegant serif)
  - Body: Inter or Poppins (clean sans-serif)
- Style: Modern with slight vintage bakery touches

**Visual Elements:**
- High-quality food photography (client provides)
- Illustrations: Subtle bakery icons (optional)
- Patterns: Light textured backgrounds (flour, wood)
- Icons: Rounded, friendly style (Feather or Lucide icons)

### 9.2 Page Layouts

**Homepage:**
- Hero section:
  - Full-width image slider (3-5 slides)
  - Overlay text (headline + CTA)
  - Auto-play with manual controls
- Featured products section:
  - Grid of 8 products
  - "Shop All" CTA button
- About section (brief):
  - Image + text (2 columns)
  - "Learn More" link
- Blog highlights:
  - Latest 3 articles (card layout)
  - "Read More Articles" button
- Instagram feed:
  - Embed latest 6-9 photos
  - Link to Instagram profile
- Newsletter signup (optional, Phase 2)
- Footer:
  - Contact info
  - Quick links
  - Social media icons
  - Copyright

**Product Pages:**
- Header with search & cart
- Breadcrumb
- Main content (see 7.1.3)
- Footer

**Blog Pages:**
- Header
- Breadcrumb
- Main content (see 7.4.3)
- Sidebar (optional, desktop only):
  - Categories
  - Popular posts
  - Search
- Footer

**Checkout:**
- Simplified header (logo + security badge)
- Progress indicator
- Form in center
- Order summary sidebar (sticky)
- Minimal footer (trust badges only)

### 9.3 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1280px

**Mobile-First Approach:**
- All layouts designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)
- Hamburger menu for mobile navigation
- Sticky header on scroll (mobile)
- Bottom navigation bar (optional, Phase 2)

### 9.4 UI Components

**Buttons:**
- Primary: Solid fill, rounded corners
- Secondary: Outline, rounded corners
- Tertiary: Text only, underline on hover
- Icon buttons: Circular or square with icon
- States: Default, hover, active, disabled

**Forms:**
- Input fields: Border, rounded, ample padding
- Labels: Above input, bold
- Validation: Inline error messages, red border
- Success: Green checkmark, success message
- Help text: Small, gray, below input

**Cards:**
- Product cards: Image top, info below, shadow on hover
- Blog cards: Similar layout, excerpt text
- Order cards: Summary with status badge

**Modals:**
- Centered overlay
- Close button (X) in corner
- Backdrop click to close
- Responsive (full screen on mobile)

**Loading States:**
- Skeleton loaders for content
- Spinner for actions (submit buttons)
- Progress bars for uploads
- Shimmer effect for images

**Empty States:**
- Illustration or icon
- Helpful message
- CTA to take action

### 9.5 Accessibility

**WCAG 2.1 Level AA Compliance:**
- Color contrast ratio minimum 4.5:1
- All images have alt text
- Form labels properly associated
- Keyboard navigation support
- Focus indicators visible
- ARIA labels where needed
- Semantic HTML (heading hierarchy)
- Skip to content link

---

## 10. INTEGRATION REQUIREMENTS

### 10.1 WhatsApp Integration

**Provider:** Fonnte.com  
**Cost:** ~Rp 100,000 - 150,000/month

**Features:**
- Send text messages
- Send with buttons (links)
- Message templates
- Delivery status tracking

**Implementation:**
- API key stored in environment variables
- Webhook endpoint for status updates (optional)
- Message queue for reliability
- Retry logic for failed messages
- Rate limiting (respect API limits)

**Messages Sent:**
- New order to admin
- Order confirmation to customer
- Status updates to customer
- Payment proof reminder

### 10.2 Email Integration

**Provider:** Resend.com  
**Cost:** Free tier (3,000 emails/month) or $20/month

**Features:**
- Transactional emails
- HTML templates
- Attachments (PDF invoice)
- Bounce handling
- Analytics (open rate, click rate)

**Implementation:**
- API key in environment variables
- React Email templates
- Queue for sending
- Retry logic
- Error logging (Sentry)

**Emails Sent:**
- Order confirmation with invoice
- Status updates
- Payment reminders
- Newsletter (Phase 2)

### 10.3 Instagram Integration

**Method:** Embed or Basic Display API

**Option A: Simple Embed (Phase 1)**
- Use Instagram embed widget
- Admin provides Instagram username
- Widget shows latest posts
- Click opens in Instagram

**Option B: API Integration (Phase 2)**
- Use Instagram Basic Display API
- Fetch posts programmatically
- Display in custom layout
- Requires Facebook Developer App

**Phase 1:** Use simple embed (easier)

### 10.4 Google Analytics (Optional)

**Provider:** Google Analytics 4 (GA4)

**Implementation:**
- Tracking ID in settings
- Next.js GA script component
- Track page views
- Track events:
  - Product view
  - Add to cart
  - Checkout started
  - Order completed
  - Search queries

### 10.5 Payment Gateway (Out of Scope - Future)

**Potential Providers:**
- Midtrans
- Xendit
- iPaymu

**Features Needed:**
- Bank transfer (virtual account)
- E-wallets (GoPay, OVO, DANA)
- Credit card
- Installment (optional)
- Auto-verification

---

## 11. TIMELINE & MILESTONES

### 11.1 Project Schedule (6 Weeks)

**Week 1: Setup & Design (5 days)**
- Day 1: Project kickoff meeting
- Day 1-2: Requirements finalization
- Day 2-3: Environment setup (dev, staging)
- Day 3-5: UI design (homepage, product, checkout)
- Day 5: Design approval from client

**Week 2: Core Backend (5 days)**
- Day 1-2: Payload CMS setup
- Day 2-3: Database schema & models
- Day 3-4: Collections (Products, Orders, Blog, Categories)
- Day 4-5: Admin panel customization
- Day 5: Backend testing

**Week 3: Frontend - Public Pages (5 days)**
- Day 1-2: Homepage & layout components
- Day 2-3: Product catalog & detail pages
- Day 3-4: Blog list & detail pages
- Day 4-5: Static pages (About, Contact)
- Day 5: Responsive testing

**Week 4: E-commerce Features (5 days)**
- Day 1-2: Shopping cart implementation
- Day 2-3: Checkout flow (all steps)
- Day 3-4: Order creation & tracking
- Day 4-5: Payment proof upload
- Day 5: E-commerce flow testing

**Week 5: Integration & Polish (5 days)**
- Day 1-2: WhatsApp & Email notifications
- Day 2-3: Instagram embed
- Day 3-4: SEO optimization
- Day 4-5: Performance optimization
- Day 5: Bug fixes & refinement

**Week 6: Testing & Launch (5 days)**
- Day 1-2: Full QA testing
- Day 2-3: Client UAT (User Acceptance Testing)
- Day 3-4: Bug fixes from UAT
- Day 4: Deployment to production
- Day 5: Training session & handover

### 11.2 Key Milestones

| Milestone              | Date       | Deliverable                       |
|------------------------|------------|-----------------------------------|
| 🚀 Project Kickoff     | Day 1      | Project brief signed              |
| 🎨 Design Approval     | Week 1     | UI mockups approved               |
| 💾 Backend Complete    | Week 2     | Admin panel functional            |
| 🌐 Frontend Complete   | Week 3     | Public site navigable             |
| 🛒 E-com Complete      | Week 4     | Can place test orders             |
| 📱 Integrations Done   | Week 5     | All integrations working          |
| ✅ QA Passed           | Week 6 D3  | All bugs fixed                    |
| 🚀 Production Launch   | Week 6 D4  | Site live on domain               |
| 📚 Training Complete   | Week 6 D5  | Client can use admin panel        |

### 11.3 Dependencies & Risks

**Dependencies:**
- Client provides content (photos, text) by Week 2
- Client reviews and approves design by Week 1 end
- Access to domain registrar by Week 5
- WhatsApp API setup (Fonnte account) by Week 5
- Email API setup (Resend account) by Week 5

**Risks & Mitigation:**
- **Risk:** Client delays content provision
  - **Mitigation:** Use placeholder content, parallel development
- **Risk:** Scope creep (additional features)
  - **Mitigation:** Refer to signed brief, phase-based approach
- **Risk:** Technical issues with integrations
  - **Mitigation:** Test early, have fallback options
- **Risk:** Client unavailable for approvals
  - **Mitigation:** Set fixed review dates, escalation path

---

## 12. DELIVERABLES

### 12.1 Technical Deliverables

**Code & Infrastructure:**
- ✅ Source code repository (GitHub private repo)
- ✅ Production-ready application (deployed)
- ✅ Staging environment (for testing)
- ✅ Database (setup with initial data)
- ✅ All environment configurations
- ✅ Deployment scripts / CI-CD pipeline

**Admin Panel:**
- ✅ Fully functional CMS
- ✅ All CRUD operations working
- ✅ Admin user account created
- ✅ Sample data populated

**Frontend Website:**
- ✅ Public-facing website (all pages)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- ✅ SEO optimized
- ✅ Performance optimized (Lighthouse >90)

**Integrations:**
- ✅ WhatsApp notification system
- ✅ Email notification system
- ✅ Instagram feed embed
- ✅ Google Analytics (if opted)

### 12.2 Documentation Deliverables

**User Documentation:**
- ✅ Admin user manual (PDF + printed copy)
- ✅ Video tutorials (screen recordings):
  - How to add products
  - How to manage orders
  - How to publish blog posts
  - How to update settings
- ✅ FAQ document
- ✅ Troubleshooting guide

**Technical Documentation:**
- ✅ System architecture document
- ✅ Database schema diagram
- ✅ API documentation
- ✅ Deployment guide
- ✅ Backup & restore procedures
- ✅ Environment variables reference

### 12.3 Training Deliverables

**Training Session (2 hours):**
- ✅ Live demonstration of admin panel
- ✅ Hands-on practice (client follows along)
- ✅ Q&A session
- ✅ Recording of training session

**Training Materials:**
- ✅ Step-by-step guides (with screenshots)
- ✅ Cheat sheet (quick reference)
- ✅ Contact information for support

### 12.4 Post-Launch Deliverables

**Within 1 Week:**
- ✅ Monitor for critical bugs
- ✅ Performance check
- ✅ Analytics setup verification

**Within 1 Month:**
- ✅ Usage report (orders, traffic)
- ✅ Feedback collection
- ✅ Minor adjustments (if needed)

---

## 13. BUDGET & PAYMENT TERMS

### 13.1 Project Cost

**Phase 1 Development:** Rp 20,000,000

**Cost Breakdown:**
- Planning & Design: Rp 3,000,000 (15%)
- Backend Development: Rp 6,000,000 (30%)
- Frontend Development: Rp 6,000,000 (30%)
- Integration & Testing: Rp 3,000,000 (15%)
- Training & Documentation: Rp 1,000,000 (5%)
- Project Management: Rp 1,000,000 (5%)

**Recurring Costs (Monthly, paid by client):**
- Hosting (Railway + CF Pages): Rp 200,000
- Domain renewal: Rp 150,000/year (~Rp 12,500/month)
- WhatsApp API (Fonnte): Rp 100,000
- Email service (Resend): Rp 0 (free tier sufficient)
- **Total Monthly:** ~Rp 312,500

### 13.2 Payment Schedule

**3-Stage Payment:**

**Stage 1 - Down Payment (30%):**
- Amount: Rp 6,000,000
- Due: Upon project kickoff (signing this brief)
- Trigger: Contract signed

**Stage 2 - Midpoint Payment (40%):**
- Amount: Rp 8,000,000
- Due: End of Week 3 (Frontend complete)
- Trigger: Client approves frontend milestone

**Stage 3 - Final Payment (30%):**
- Amount: Rp 6,000,000
- Due: Upon project completion
- Trigger: UAT passed, site launched, training complete

**Payment Method:**
- Bank transfer to: [Bank details]
- Invoice issued for each stage
- Payment due within 3 business days of invoice

### 13.3 Additional Costs (Out of Scope)

**Not Included in Phase 1:**
- Domain registration (client purchases separately)
- Content creation (photos, copywriting)
- Stock images (if needed, client purchases)
- Phase 2 & 3 features (separate quotation)
- Ongoing maintenance (optional, see 18.2)
- Marketing & SEO services
- Custom integrations beyond specified
- Mobile app development

**Change Request Fees:**
- Minor changes (< 2 hours): Included
- Major changes: Rp 500,000/hour
- New features: Separate quotation

---

## 14. ASSUMPTIONS & CONSTRAINTS

### 14.1 Assumptions

**Content & Assets:**
- ✅ Client provides all product photos (high resolution)
- ✅ Client provides all text content (product descriptions, about)
- ✅ Client has logo in vector format (AI/SVG) or high-res PNG
- ✅ Content provided in Indonesian language
- ✅ Client owns rights to all provided content

**Technical:**
- ✅ Client has access to domain registrar
- ✅ Domain DNS can be updated (for Cloudflare)
- ✅ Client can sign up for external services (WhatsApp API, etc.)
- ✅ Client has valid business email address
- ✅ Website will be in Indonesian language only (Phase 1)

**Business:**
- ✅ Client has necessary business licenses
- ✅ Products comply with local regulations
- ✅ Client handles order fulfillment (baking & delivery)
- ✅ Client has bank account for receiving payments
- ✅ Client available for regular check-ins (weekly)

**Users:**
- ✅ Target users have internet access
- ✅ Target users comfortable with online ordering
- ✅ Admin users can use computers/tablets
- ✅ Admin users can learn new software

### 14.2 Constraints

**Technical Constraints:**
- ❌ Payment gateway integration not in Phase 1 (dummy payment only)
- ❌ No real-time inventory sync with physical stock
- ❌ No mobile app (web-only)
- ❌ No multi-language support (Indonesian only)
- ❌ No live chat (WhatsApp button only)
- ❌ Cloudflare Workers cannot host the CMS (requires Railway)

**Time Constraints:**
- ⏱️ 6-week timeline is fixed
- ⏱️ Delays in client approvals extend timeline
- ⏱️ Scope changes may extend timeline

**Budget Constraints:**
- 💰 Phase 1 budget is Rp 20,000,000
- 💰 Advanced features require Phase 2 budget
- 💰 Third-party service costs separate

**Resource Constraints:**
- 👤 1 full-stack developer assigned
- 👤 1 UI/UX designer (part-time)
- 👤 Client must dedicate time for reviews

---

## 15. CHANGE MANAGEMENT

### 15.1 Change Request Process

**Steps for Requesting Changes:**

1. **Submit Change Request**
   - Client emails detailed request
   - Include: what needs to change, why, urgency

2. **Impact Assessment**
   - Developer assesses impact on:
     - Timeline (days added)
     - Cost (additional budget)
     - Scope (affects other features?)
   - Assessment provided within 2 business days

3. **Quotation**
   - Developer provides:
     - Time estimate
     - Cost estimate
     - Updated timeline
   - Includes pros/cons if applicable

4. **Approval**
   - Client reviews quotation
   - Approves or rejects in writing
   - If approved, sign change order

5. **Implementation**
   - Change implemented per new schedule
   - Regular updates on progress
   - Testing and review

6. **Completion**
   - Change delivered
   - Additional payment (if any)
   - Documentation updated

### 15.2 Change Request Categories

**Minor Changes (Free, < 2 hours):**
- Text copy changes
- Color/styling tweaks
- Layout minor adjustments
- Bug fixes (errors caused by developer)
- **Limit:** 5 minor changes included

**Medium Changes (Rp 500,000 - 2,000,000):**
- New page addition
- Significant layout changes
- New email template
- Additional notification type
- Integration tweaks

**Major Changes (Rp 2,000,000+):**
- New core feature (e.g., reviews, wishlists)
- Major redesign
- New integration (payment gateway)
- Architecture changes
- These typically go to Phase 2/3

### 15.3 Out of Scope Changes

**Will Not Be Implemented (Phase 1):**
- ❌ Member login & membership system
- ❌ Loyalty points & rewards
- ❌ Advanced promo codes (Buy X Get Y, etc.)
- ❌ Product reviews & ratings
- ❌ Wishlist functionality
- ❌ Real payment gateway
- ❌ Mobile app
- ❌ Live chat
- ❌ Multi-language
- ❌ Advanced analytics dashboard
- ❌ CRM features
- ❌ Marketing automation
- ❌ Social media auto-posting

**Refer to Appendix A** for Phase 2/3 features.

---

## 16. TESTING & QUALITY ASSURANCE

### 16.1 Testing Strategy

**Types of Testing:**

**1. Unit Testing**
- Test individual functions & components
- Automated tests (Vitest)
- Target: 70%+ code coverage for business logic
- Run automatically on every commit (CI)

**2. Integration Testing**
- Test API endpoints
- Test database operations
- Test external integrations (WhatsApp, Email)
- Automated where possible

**3. Manual Testing**
- Test user flows end-to-end
- Test on multiple devices
- Test edge cases
- Exploratory testing

**4. Cross-Browser Testing**
- Chrome (latest)
- Firefox (latest)
- Safari (latest, iOS & macOS)
- Edge (latest)
- Mobile browsers (Chrome Mobile, Safari iOS)

**5. Responsive Testing**
- Mobile (various screen sizes)
- Tablet (iPad, Android tablets)
- Desktop (various resolutions)
- Test portrait and landscape

**6. Performance Testing**
- Lighthouse audits (target >90)
- Load time testing (< 3s initial load)
- Image optimization check
- API response time (< 200ms p95)

**7. Security Testing**
- OWASP Top 10 checks
- XSS prevention
- SQL injection testing
- Authentication & authorization
- Sensitive data handling

**8. Accessibility Testing**
- Screen reader compatibility (NVDA, VoiceOver)
- Keyboard navigation
- Color contrast checks
- WCAG 2.1 Level AA compliance

**9. User Acceptance Testing (UAT)**
- Client tests all features
- Real-world scenarios
- Feedback collection
- Sign-off before launch

### 16.2 Test Cases

**Critical User Flows to Test:**

**E-commerce Flow:**
1. Browse products → View detail → Add to cart → Checkout → Order confirmation
2. Search products → Filter by category → Add multiple items → Checkout
3. Receive order confirmation email & WhatsApp
4. Track order via link
5. Upload payment proof

**Admin Flow:**
1. Login to admin panel
2. Create new product with variants
3. Receive new order notification
4. View order details
5. Confirm payment (change status)
6. Update order status (multiple times)
7. Customer receives status notifications
8. Export orders to CSV

**Blog Flow:**
1. Admin creates new blog post
2. Publish post
3. View on frontend
4. Search for post
5. Filter by category

### 16.3 Bug Tracking & Resolution

**Bug Classification:**

**Critical (P0):**
- Site down / not accessible
- Cannot place orders
- Data loss
- Security vulnerability
- **SLA:** Fix within 4 hours

**High (P1):**
- Feature not working
- Major UI issue
- Notification not sent
- **SLA:** Fix within 24 hours

**Medium (P2):**
- Minor feature issue
- UI inconsistency
- Non-critical bug
- **SLA:** Fix within 3 days

**Low (P3):**
- Cosmetic issue
- Enhancement request
- Nice-to-have fix
- **SLA:** Fix in next update or backlog

**Bug Report Template:**
```
Title: [Brief description]
Priority: [P0/P1/P2/P3]
Reporter: [Name]
Date: [Date]

Description:
[Detailed description of the issue]

Steps to Reproduce:
1. Go to...
2. Click on...
3. See error

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach screenshots if applicable]

Environment:
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 13]
- OS: [e.g., iOS 17]

Additional Notes:
[Any other relevant info]
```

### 16.4 Quality Metrics

**Acceptance Criteria:**

**Performance:**
- Lighthouse Performance: >90
- Time to Interactive: <3.5s
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s

**Functionality:**
- All features working as specified
- Zero critical bugs at launch
- < 3 high-priority bugs at launch

**Compatibility:**
- Works on 95%+ of target browsers
- Mobile responsive on all pages
- Accessible (WCAG AA)

**User Experience:**
- Intuitive navigation (UAT feedback)
- Clear calls-to-action
- Helpful error messages
- Fast page loads

---

## 17. TRAINING & DOCUMENTATION

### 17.1 Training Plan

**Training Session:** 2-hour hands-on session

**Agenda:**

**Part 1: Admin Panel Overview (30 min)**
- Login & dashboard tour
- Navigation & menu structure
- Understanding the interface
- Settings overview

**Part 2: Product Management (30 min)**
- Adding new products
- Managing variants
- Uploading images
- Setting categories
- Managing stock
- Practice exercise: Add 2 products

**Part 3: Order Management (30 min)**
- Viewing new orders
- Understanding order details
- Updating order status
- Verifying payments
- Printing invoices
- Practice exercise: Process 2 test orders

**Part 4: Content Management (20 min)**
- Creating blog posts
- Managing categories
- Uploading media
- Practice exercise: Create 1 blog post

**Part 5: Q&A & Advanced Topics (10 min)**
- Site settings
- Notifications
- Troubleshooting common issues
- Where to get help

**Training Format:**
- Live session (in-person or video call)
- Screen share with recording
- Hands-on exercises
- Q&A throughout
- Recording provided after session

**Training Materials Provided:**
- Printed user manual (bound)
- Digital user manual (PDF)
- Video recordings (per topic)
- Quick reference guide (cheat sheet)
- FAQ document

### 17.2 Documentation Structure

**Admin User Manual** (40-50 pages)

**Table of Contents:**
1. Getting Started
   1.1. Logging In
   1.2. Dashboard Overview
   1.3. Navigation

2. Product Management
   2.1. Viewing Products
   2.2. Adding New Products
   2.3. Editing Products
   2.4. Managing Variants
   2.5. Stock Management
   2.6. Deleting Products
   2.7. Categories & Tags

3. Order Management
   3.1. Viewing Orders
   3.2. Order Details
   3.3. Updating Order Status
   3.4. Payment Verification
   3.5. Printing Invoices
   3.6. Exporting Data

4. Content Management
   4.1. Creating Blog Posts
   4.2. Editing Blog Posts
   4.3. Managing Media
   4.4. Blog Categories

5. Site Settings
   5.1. General Information
   5.2. Contact Details
   5.3. Shipping Settings
   5.4. Payment Settings
   5.5. Notifications
   5.6. WhatsApp Integration

6. Reports & Analytics
   6.1. Dashboard Metrics
   6.2. Sales Reports
   6.3. Product Performance
   6.4. Exporting Data

7. Troubleshooting
   7.1. Common Issues
   7.2. Error Messages
   7.3. Getting Help

8. Appendix
   8.1. Glossary
   8.2. Keyboard Shortcuts
   8.3. Best Practices

**Technical Documentation** (for reference)

1. System Architecture
2. Database Schema
3. API Documentation
4. Deployment Guide
5. Backup & Restore
6. Security Guidelines
7. Performance Optimization
8. Environment Variables

---

## 18. SUPPORT & MAINTENANCE

### 18.1 Post-Launch Support (Included)

**1 Month Free Support** (from launch date)

**Included:**
- Bug fixes (any bugs found post-launch)
- Minor content updates (text, images)
- Performance monitoring
- Security patches (if needed)
- Email/WhatsApp support
- Response time: Within 24 hours (business days)

**Not Included:**
- New features
- Major design changes
- Content creation (beyond updates)
- Marketing support
- SEO optimization (beyond setup)

### 18.2 Ongoing Maintenance (Optional)

**Monthly Maintenance Package:** Rp 2,000,000/month

**Includes:**
- 5 hours of development time (rollover unused hours)
- Priority support (response within 4 hours)
- Monthly updates (dependencies, security)
- Monthly backup verification
- Performance monitoring & optimization
- Quarterly strategy call
- Bug fixes (unlimited)
- Minor feature tweaks
- Content updates (reasonable)

**Typical Use Cases:**
- Seasonal design updates
- New product categories
- Additional pages
- Feature enhancements
- Integration additions
- Performance improvements

**Contract:** Month-to-month, cancel anytime with 30 days notice

### 18.3 Emergency Support

**Emergency Contact:** [Developer phone/WhatsApp]

**Emergencies Defined:**
- Site completely down
- Critical security issue
- Data loss incident
- Payment system failure

**Response Time:**
- Acknowledged: Within 1 hour
- Diagnosis: Within 2 hours
- Resolution ETA: Within 4 hours

**Emergency Support Cost:**
- Within office hours (9 AM - 6 PM): Free (first month)
- After hours: Rp 1,000,000/incident (after first month)
- Weekends/holidays: Rp 1,500,000/incident

### 18.4 Backup & Disaster Recovery

**Automated Backups:**
- Database: Daily (midnight WIB)
- Media files: Weekly
- Retention: 30 days rolling
- Storage: Railway automated + manual download

**Backup Testing:**
- Monthly restore test (staging environment)
- Documented restore procedures
- Recovery Time Objective (RTO): 2 hours
- Recovery Point Objective (RPO): 24 hours

**Disaster Recovery Plan:**
1. Identify issue
2. Notify client immediately
3. Assess damage
4. Restore from latest backup
5. Verify data integrity
6. Resume operations
7. Post-mortem report

### 18.5 Software Updates

**Regular Updates:**
- Dependencies: Monthly security patches
- Framework versions: Quarterly (if stable)
- Major versions: Annual (with testing)

**Update Process:**
1. Test in staging environment
2. Backup production
3. Deploy during low-traffic hours
4. Monitor for issues
5. Rollback if problems
6. Document changes

**Client Notification:**
- Advance notice (48 hours) for planned updates
- Downtime estimate (typically < 15 minutes)
- Post-update report

---

## 19. SUCCESS CRITERIA

### 19.1 Technical Success Criteria

**Launch Readiness:**
- [ ] All features functional and tested
- [ ] Zero critical bugs
- [ ] <3 high-priority bugs (with workarounds)
- [ ] Performance scores meet targets (Lighthouse >90)
- [ ] Mobile responsive on all pages
- [ ] Cross-browser compatible
- [ ] HTTPS enabled
- [ ] SEO basics implemented
- [ ] Analytics tracking active
- [ ] Backups configured and tested

**Post-Launch (1 Week):**
- [ ] No critical bugs reported
- [ ] Site uptime >99.5%
- [ ] Notifications working reliably
- [ ] Client comfortable using admin panel

### 19.2 Business Success Criteria

**Immediate (Launch Week):**
- [ ] Client successfully processes first order independently
- [ ] Client can add new products without assistance
- [ ] Customer orders placed and fulfilled
- [ ] Positive client feedback

**Short-Term (3 Months):**
- 50+ orders processed
- 20+ products listed
- 10+ blog posts published
- 1,000+ site visits
- 5% conversion rate (visits to orders)
- Client operates site independently

**Long-Term (6 Months):**
- 200+ orders processed
- 30% revenue increase (vs pre-website)
- Growing customer database
- Reduced admin workload (vs manual process)
- Positive customer reviews
- Client considers Phase 2 features

### 19.3 User Satisfaction Criteria

**Client Satisfaction:**
- Ease of use rating: 4/5 or higher
- Would recommend: Yes
- Willing to provide testimonial: Yes

**Customer Satisfaction:**
- Order process: Easy and clear
- Website speed: Fast
- Mobile experience: Good
- Would order again: Yes

**Measurement Methods:**
- Post-launch survey (client)
- Follow-up interview (1 month)
- Customer feedback form (optional on site)
- Google Reviews / testimonials

---

## 20. APPENDIX A: PHASE 2 & 3 SCOPE

### Phase 2: Enhanced Features (Rp 15,000,000)

**Timeline:** 4 weeks

**Features:**

**Member System & Authentication:**
- Customer registration & login
- Member dashboard (order history, saved addresses)
- Profile management
- Member-only pricing (10% discount)
- Guest checkout still available

**Loyalty Points:**
- Earn points per purchase (10,000 spent = 1 point)
- Points dashboard in member area
- Redeem points for vouchers
- Points expiry (1 year)
- Admin can adjust points manually

**Advanced Promo Codes:**
- Percentage discounts (10%, 20%, etc.)
- Fixed amount discounts (Rp 50k off)
- Free shipping codes
- Buy X Get Y codes
- Minimum order value requirements
- Usage limits (per code, per user)
- Expiry dates
- Admin creates and manages codes

**Product Reviews & Ratings:**
- Customers can leave reviews (if ordered)
- 5-star rating system
- Text review with photos
- Admin moderation (approve/reject)
- Display average rating on products
- Sort by rating

**Wishlist:**
- Add products to wishlist (logged in users)
- View wishlist page
- Add to cart from wishlist
- Share wishlist (optional)

**Order Exports & Reports:**
- Export to Excel with filters
- Date range selection
- Sales reports (daily, weekly, monthly)
- Product performance report
- Customer report

**Enhanced Analytics Dashboard:**
- Revenue charts (line graph, bar chart)
- Top products table
- Customer acquisition graph
- Conversion funnel
- Custom date ranges

### Phase 3: Advanced Features (Rp 20,000,000)

**Timeline:** 5 weeks

**Features:**

**Custom Orders & Quotations:**
- Custom order request form
- Upload reference images
- Describe requirements
- Admin reviews and provides quote
- Customer approves quote
- Becomes regular order

**Flash Sales:**
- Time-limited discounts
- Countdown timer
- Limited stock per flash sale
- Schedule start/end dates
- Auto-disable when expired

**Product Comparison:**
- Select 2-3 products to compare
- Side-by-side comparison table
- Compare price, ingredients, size, etc.

**Product Recommendations:**
- "You may also like" (based on category)
- "Frequently bought together"
- "Related products"
- Algorithm-based suggestions

**Abandoned Cart Recovery:**
- Track carts not checked out
- Send reminder emails after 24 hours
- Include cart contents in email
- Direct link to resume checkout

**Multi-Admin with Roles:**
- Super Admin (full access)
- Admin (products & orders)
- Staff (orders only)
- Granular permissions
- Activity log per user

**Advanced Notifications:**
- SMS notifications (via Twilio)
- Push notifications (PWA, Phase 3+)
- Email marketing campaigns
- Scheduled messages

**Promotional Banners:**
- Create banner campaigns
- Upload images, set links
- Schedule start/end dates
- Position control (hero, sidebar, popup)
- Auto-activate/deactivate

**Product Q&A:**
- Customers ask questions on product page
- Admin answers via admin panel
- Q&A displayed on product page
- Helpful/not helpful votes

**Bundle Products:**
- Create product bundles (e.g., "Party Package")
- Bundle pricing (discounted)
- Stock management for bundles
- Display bundle contents

---

## 21. APPENDIX B: OUT OF SCOPE

### Not Included in Any Phase

**Mobile Applications:**
- iOS app
- Android app
- React Native/Flutter app
- App store deployment

**Advanced Integrations:**
- Accounting software (Accurate, Jurnal)
- Inventory management systems
- CRM platforms (Salesforce, HubSpot)
- ERP systems

**Advanced Payment Features:**
- Installment plans (Kredivo, Akulaku)
- Cryptocurrency payments
- International payment methods

**Multi-Vendor Marketplace:**
- Multiple sellers on one platform
- Seller registration & dashboard
- Commission management
- Split payments

**Advanced Shipping:**
- Real-time shipping rate calculation (JNE, Sicepat API)
- Print shipping labels
- Track shipment (courier integration)
- Multi-warehouse management

**Social Commerce:**
- Facebook Shop integration
- Instagram Shopping
- TikTok Shop integration
- Social media auto-posting

**Advanced Marketing:**
- Email marketing automation (drip campaigns)
- SMS marketing campaigns
- Push notification marketing
- Affiliate program
- Referral system

**Live Features:**
- Live chat (real-time)
- Live shopping / live streaming
- Real-time inventory (POS integration)

**Subscription & Recurring:**
- Subscription products (monthly cake box)
- Recurring payments
- Subscription management

**International:**
- Multi-currency
- Multi-language
- International shipping
- Tax calculation (VAT, etc.)

**AI & ML Features:**
- AI-powered recommendations
- Chatbots
- Image recognition
- Price optimization

**Custom Hardware Integration:**
- POS system integration
- Barcode scanner
- Receipt printer
- Kitchen display system

---

## 22. SIGN-OFF

This project brief represents the complete understanding and agreement between the client and developer for Phase 1 of the Toko Kue Bu Siti e-commerce platform development.

**Client Acknowledgment:**

I, the undersigned, have read, understood, and agree to the scope, timeline, budget, and terms outlined in this project brief. I understand that:

- Phase 1 scope is as defined in Section 5
- Timeline is 6 weeks from kickoff
- Budget is Rp 20,000,000 (payment schedule in Section 13)
- Additional features require separate quotation (Phase 2/3)
- Change requests follow process in Section 15
- Support is 1 month post-launch (Section 18)

I confirm that I have the authority to sign this agreement on behalf of the business.

**Client Signature:**

```
Name: ______________________________

Title: ______________________________

Signature: ______________________________

Date: ______________________________
```

**Developer Acknowledgment:**

I, the undersigned, commit to delivering the project as specified in this brief, within the agreed timeline and budget, to the best of my ability.

**Developer Signature:**

```
Name: ______________________________

Company: ______________________________

Signature: ______________________________

Date: ______________________________
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-02-20 | [Developer] | Initial draft |
| | | | |

**Distribution:**
- Client: 1 signed printed copy + PDF
- Developer: 1 signed printed copy + PDF
- Project file: Digital copy in project repository

---

## Attachments

1. **Appendix C:** UI Mockups (separate PDF)
2. **Appendix D:** Database Schema Diagram (separate PDF)
3. **Appendix E:** Content Requirements List (separate spreadsheet)
4. **Appendix F:** Sample Data (products.csv, categories.csv)

---

**END OF PROJECT BRIEF**

*This document is confidential and proprietary. Do not distribute without authorization.*
