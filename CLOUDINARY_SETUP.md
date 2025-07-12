# Cloudinary Setup Instructions

## Step 1: Get Your Cloudinary Credentials

1. **Log in to your Cloudinary account** at https://cloudinary.com/
2. **Get your Cloud Name** from the dashboard (it's displayed prominently)
3. **Create an Upload Preset**:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Set the following:
     - **Preset name**: Choose a name (e.g., "rewear_upload")
     - **Signing mode**: Select "Unsigned"
     - **Folder**: Set to "rewear" (this will organize all uploads)
     - **Access mode**: Public read
   - Save the preset

## Step 2: Configure Your Environment

1. **Copy the environment file**:

   ```bash
   cp client/.env.example client/.env.local
   ```

2. **Edit `client/.env.local`** with your actual values:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_actual_upload_preset_name
   ```

## Step 3: Test the Setup

1. **Start your development server**:

   ```bash
   cd client
   npm run dev
   ```

2. **Navigate to the item listing page** and try uploading an image
3. **Check your Cloudinary dashboard** to see if images appear in the "rewear" folder

## Important Notes

- **Upload Preset must be "Unsigned"** to work with client-side uploads
- **The folder "rewear"** will be automatically created in your Cloudinary account
- **File size limit** is set to 10MB per image
- **Only image files** are accepted (jpg, png, gif, webp, etc.)

## Security Considerations

- The upload preset is unsigned, which means anyone with the preset name can upload to your account
- Consider adding additional security measures in production:
  - Rate limiting on your server
  - User authentication checks
  - File type and size validation on the server side

## Troubleshooting

If uploads fail:

1. Check that your cloud name and upload preset are correct
2. Ensure the upload preset is set to "Unsigned"
3. Check the browser console for detailed error messages
4. Verify your Cloudinary account has sufficient upload quota
