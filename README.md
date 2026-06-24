# Agentic Marketplace — Tech Stack & Backend Developer Roadmap

Welcome to the **Agentic Marketplace** engineering workspace. This document is a comprehensive roadmap for full-stack and backend engineers to transition this high-fidelity React frontend MVP into a production-ready, cloud-scaled agentic commerce platform.

---

## 1. Product Architectural Blueprint

Currently, this application is structured as a client-side Single Page Application (SPA) with:
- **Vite & React 19** as the reactive UI layer.
- **ThreeJS / React Three Fiber** rendering the interactive background nodes and optimized visual card meshes at peak FPS.
- **Tailwind CSS** driving the cohesive modern cyberpunk theme and responsive viewport densities.
- **Framer Motion** conducting micro-interactions, spring physics, and fluid entrance triggers.

### Proposed Production Architecture:
```
                                +---------------------------+
                                |    Nginx Ingress Proxy    |
                                +-------------+-------------+
                                              |
                      +-----------------------+-----------------------+
                      |                                               | (Static Assets)
        +-------------v-------------+                   +-------------v-------------+
        |   Express API Router      |                   |   React Frontend (Vite)   |
        |   (Authentication, DB)    |                   |   (Matrix Theme Canvas)   |
        +-------------+-------------+                   +---------------------------+
                      |
         +------------+------------+
         |                         |
+--------v---------+      +--------v---------+
|  Cloud SQL (Pg)  |      |  Redis (Caching) |
|  & Drizzle ORM   |      |  & Rate Limiting |
+------------------+      +------------------+
```

---

## 2. Database Schema & Data Models

Depending on your engineering requirements, you can implement either a relational SQL DB (via PostgreSQL / Cloud SQL) or a document-based store (via Google Firestore).

### Relational Database Schema (PostgreSQL with Drizzle ORM)

Create a `/src/db/schema.ts` definition:

```typescript
import { pgTable, uuid, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";

// Users & Developer Profiles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  isDeveloper: boolean("is_developer").default(false).notNull(),
});

// Waitlist Subscriptions
export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  signupIp: varchar("signup_ip", { length: 100 }),
  userAgent: varchar("user_agent", { length: 500 }),
  queueNumber: integer("queue_number").serial().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Registry
export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  developerId: uuid("developer_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  description: varchar("description", { length: 1000 }),
  version: varchar("version", { length: 24 }).default("1.0.0").notNull(),
  schemaEndpoint: varchar("schema_endpoint", { length: 512 }).notNull(),
  pricingType: varchar("pricing_type", { length: 50 }).default("usage").notNull(), // 'subscription', 'per-execution', 'hybrid'
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 4 }).default("0.0000").notNull(),
  status: varchar("status", { length: 30 }).default("pending_verification").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Financial Transaction Ledger
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").references(() => agents.id).notNull(),
  buyerId: uuid("buyer_id").references(() => users.id).notNull(),
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(), // Strictly 1.00% fee
  developerPayout: decimal("developer_payout", { precision: 10, scale: 2 }).notNull(), // 99.00% payout
  paymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).unique(),
  ledgerStatus: varchar("ledger_status", { length: 50 }).default("escrow_pending").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
```

---

## 3. Micro-Billing Infrastructure (The 1% Standard)

To implement the platform's standard of **flat 1% transaction fees**, integrate **Stripe Connect** with split routing:

1. **Stripe Express Accounts**: When a developer registers an agent, have them complete an onboard redirect to Stripe Express to connect their bank account.
2. **Dynamic Payout Calculations**:
   - Total Interaction Cost ($C_{total}$)
   - Platform Cut: $C_{platform} = C_{total} \times 0.01$ (1%)
   - Developer Share: $C_{developer} = C_{total} \times 0.99$ (99%)
3. **API Implementation (Express API Controller)**:

```typescript
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" as any });

export async function processAgentExecutionCharge(
  buyerStripeId: string, 
  developerStripeConnectedId: string, 
  amountInCents: number
) {
  const platformFeeInCents = Math.round(amountInCents * 0.01); // 1%
  
  // Create an automatic split transfer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    customer: buyerStripeId,
    payment_method_types: ["card"],
    application_fee_amount: platformFeeInCents, // retained by the marketplace platform
    transfer_data: {
      destination: developerStripeConnectedId, // 99% immediately routed to developer's bank
    },
  });
  
  return paymentIntent;
}
```

---

## 4. The Intelligent Mesh Protocol (Agent-to-Agent Mesh Routing)

For programmatic machine-to-machine interactions, the platform supports real-time telemetry pipelines:
- **Server-Sent Events (SSE)** or **WebSockets** for streaming model tokens between connected agents.
- **Encrypted API Payload Gateways**: Every mesh execution requires verified bearer signatures verifying the identity of the calling agent node.

---

## 5. Setting up the Full-Stack Express Server

If you need to mount a live Express server to proxy calls and protect database secrets, configure a custom full-stack architecture inside the workspace:

### Step 5a: Modify `package.json` scripts
Modify scripts in `package.json` to bind TypeScript compilers:
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs"
  }
}
```

### Step 5b: Create `/server.ts` entry point
```typescript
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route Gateways
  app.post("/api/waitlist/join", (req, res) => {
    const { email } = req.body;
    // TODO: Perform database insert
    const mockQueueNum = Math.floor(3420 + Math.random() * 100);
    res.status(200).json({ success: true, queueNumber: mockQueueNum });
  });

  // Serve Frontend assets based on execution mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER_ONLINE] Agentic Commerce Core on http://localhost:${PORT}`);
  });
}

startServer();
```

---

*Developed by Skipscape. High-Performance WebGL and custom canvas matrix background optimized for global systems deployment.*
