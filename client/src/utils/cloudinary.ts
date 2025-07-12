export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET",
  folder: "rewear",
};

export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(
      "File size too large. Please choose a file smaller than 10MB."
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", CLOUDINARY_CONFIG.folder);

  try {
    const response = await fetch(getCloudinaryUploadUrl(), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw error;
  }
};
