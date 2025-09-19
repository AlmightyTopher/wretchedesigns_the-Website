# Authentication API Contract

**Endpoint**: `/api/auth/*`
**Purpose**: NextAuth.js authentication endpoints for Google OAuth
**Provider**: Google OAuth 2.0

## Authentication Flow

### 1. Sign In Initiation

**Endpoint**: `/api/auth/signin/google`
**Method**: GET
**Description**: Initiates Google OAuth flow

#### Request
```http
GET /api/auth/signin/google
```

#### Response
- **Success**: Redirects to Google OAuth consent screen
- **Error**: Redirects to `/api/auth/error`

### 2. OAuth Callback

**Endpoint**: `/api/auth/callback/google`
**Method**: GET/POST
**Description**: Handles Google OAuth callback

#### Request
```http
GET /api/auth/callback/google?code={authCode}&state={state}
```

#### Response
- **Success**: Redirects to `/admin` with session cookie
- **Access Denied**: Redirects to `/api/auth/error?error=AccessDenied`
- **Error**: Redirects to `/api/auth/error?error={errorType}`

### 3. Session Management

**Endpoint**: `/api/auth/session`
**Method**: GET
**Description**: Retrieve current session information

#### Request
```http
GET /api/auth/session
Cookie: next-auth.session-token={sessionToken}
```

#### Response
```typescript
// Authenticated
{
  "user": {
    "email": "string (admin email)",
    "name": "string (Google display name)",
    "image": "string (Google profile image URL)"
  },
  "expires": "string (ISO 8601 timestamp)"
}

// Not authenticated
{
  "user": null,
  "expires": null
}
```

### 4. Sign Out

**Endpoint**: `/api/auth/signout`
**Method**: POST
**Description**: Terminate user session

#### Request
```http
POST /api/auth/signout
Cookie: next-auth.session-token={sessionToken}
Content-Type: application/json
```

```typescript
{
  "csrfToken": "string (CSRF protection token)"
}
```

#### Response
- **Success**: Clears session cookie, redirects to home page
- **Error**: Returns error status

## Authorization Rules

### Admin Email Validation
```typescript
// Implemented in src/lib/auth.ts
async function signIn({ user, account, profile }) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(user.email || "");
}
```

### Access Control
- **Allowed Email**: `Topher@TopherTek.com`
- **OAuth Provider**: Google only
- **Session Duration**: 30 days (default NextAuth.js)
- **CSRF Protection**: Enabled by default

## Session Structure

### Session Cookie
```typescript
interface SessionToken {
  email: string;           // Admin email address
  name?: string;           // Google display name
  picture?: string;        // Google profile image
  iat: number;            // Issued at timestamp
  exp: number;            // Expiration timestamp
  jti: string;            // JWT ID
}
```

### Cookie Configuration
- **Name**: `next-auth.session-token`
- **HttpOnly**: true
- **Secure**: true (production)
- **SameSite**: "lax"
- **Path**: "/"

## Error Handling

### Error Types
```typescript
type AuthError =
  | "AccessDenied"        // Email not in admin list
  | "Configuration"       // OAuth setup error
  | "Verification"        // Email verification failed
  | "Default"            // Unknown error
```

### Error Pages
- **Sign In Error**: `/auth/error?error={errorType}`
- **Access Denied**: Custom message for unauthorized emails
- **Configuration Error**: OAuth setup issues

## Security Features

### CSRF Protection
- All authentication requests include CSRF tokens
- Validates state parameter in OAuth flow
- Prevents cross-site request forgery attacks

### Session Security
- JWT-based sessions with secure signing
- Automatic session refresh
- Secure cookie attributes in production

### OAuth Security
- PKCE (Proof Key for Code Exchange) enabled
- State parameter validation
- Nonce verification for ID tokens

## Integration Points

### Protected API Routes
```typescript
// Usage in API routes
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Proceed with authenticated operation
}
```

### Protected Pages
```typescript
// Usage in page components
"use client";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") redirect("/auth/signin");

  return <AdminDashboard />;
}
```

## Configuration

### Environment Variables
```bash
NEXTAUTH_URL=https://www.wretchedesigns.com
NEXTAUTH_SECRET=secure-random-string-32-chars-minimum
GOOGLE_CLIENT_ID=57848607243-o5omf12h5emrc3e64lk5073vianism1f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ADMIN_EMAILS=Topher@TopherTek.com
```

### Google OAuth Setup
- **Authorized Redirect URIs**:
  - `https://www.wretchedesigns.com/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (development)

## Rate Limiting
- **Sign In Attempts**: 10 per minute per IP
- **Session Requests**: 100 per minute per IP
- **OAuth Callbacks**: Standard Google limits

## Monitoring & Logging
- Failed authentication attempts logged
- Session creation/destruction events tracked
- OAuth errors reported to application logs

---
**Implementation Status**: ✅ Fully implemented and operational
**Last Updated**: 2025-01-09