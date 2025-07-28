import { createClient } from "@supabase/supabase-js";

const url = "https://mprpbenevvjyevywnnlr.supabase.co";
const key = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcnBiZW5ldnZqeWV2eXdubmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDE5OTUsImV4cCI6MjA2Mjg3Nzk5NX0.iGyxM8J8o4brygHvhYi-ieDeGvCRfUs9hY9kphus7RY";

const supabase = createClient(url, key);

// Utility to generate a random string for unique filenames
const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function uploadMediaToSupabase(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return reject(new Error("Only JPEG, PNG, or GIF images are allowed"));
    }

    const extension = file.name.split(".").pop();
    const timestamp = new Date().getTime();
    const randomString = generateRandomString(8); // Add a random 8-character string
    const fileName = `${timestamp}_${randomString}.${extension}`; // Unique filename

    supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(({ data, error }) => {
        if (error) {
          return reject(new Error(`Supabase upload failed: ${error.message}`));
        }
        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
        resolve(publicUrl);
      })
      .catch((err) => {
        reject(new Error(`Supabase error: ${err.message}`));
      });
  });
}