# Google OAuth Configuration for Wretched Designs

## Current Configuration

Your Google OAuth app is already set up with these details:

- **Client ID**: `57848607243-o5omf12h5emrc3e64lk5073vianism1f.apps.googleusercontent.com`
- **Client Secret**: `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`
- **Project ID**: `gen-lang-client-0797048123`

## Required Redirect URIs

Make sure these redirect URIs are configured in your Google Cloud Console:

### Production
- `https://www.wretchedesigns.com/api/auth/callback/google`

### Development
- `http://localhost:3000/api/auth/callback/google`

## How to Update Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `gen-lang-client-0797048123`
3. Navigate to: APIs & Services > Credentials
4. Click on your OAuth 2.0 Client ID
5. In "Authorized redirect URIs", add:
   - `https://www.wretchedesigns.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. Save changes

## Testing

### Local Development
1. Make sure `.env.local` has the correct credentials
2. Run `npm run dev`
3. Visit `http://localhost:3000/admin`
4. You should be redirected to Google sign-in

### Production
1. Deploy to Cloudflare Pages with environment variables set
2. Visit `https://www.wretchedesigns.com/admin`
3. Sign in with Google account listed in ADMIN_EMAILS

## Admin Access

Only email addresses listed in the `ADMIN_EMAILS` environment variable can access the admin dashboard after Google authentication.

Current admin check is in: `src/lib/auth.ts`