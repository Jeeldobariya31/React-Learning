import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import appwriteService from "../appWrite/config"; // keep your service import

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINY_KEY}
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              automatic_uploads: true,

              /* Robust images_upload_handler — logs, normalizes URL, validates absolute URL */
              images_upload_handler: async (blobInfo, progress) => {
                try {
                  const file = blobInfo.blob();
                  console.log("[RTE] uploading file blob", {
                    name: blobInfo.filename(),
                    size: blobInfo.size(),
                    type: file.type,
                  });

                  // call your existing upload helper
                  const uploaded = await appwriteService.uploadFile(file);
                  console.log("[RTE] appwrite upload response:", uploaded);

                  // getFilePreview may return a string or an object with href
                  const maybeUrl = await appwriteService.getFilePreview(uploaded.$id);
                  console.log("[RTE] appwrite preview result:", maybeUrl);

                  // normalize to string href
                  const url =
                    maybeUrl && typeof maybeUrl === "object" && maybeUrl.href
                      ? maybeUrl.href
                      : typeof maybeUrl === "string"
                      ? maybeUrl
                      : null;

                  if (!url) {
                    throw new Error(
                      "No valid URL returned from appwriteService.getFilePreview. Check upload permissions and preview method."
                    );
                  }

                  // ensure absolute URL
                  if (!/^https?:\/\//i.test(url)) {
                    // Optionally, if your preview returns a path, prefix with your endpoint
                    throw new Error("Returned URL is not absolute: " + url);
                  }

                  // Optional: test HEAD/GET quickly (not required — but helpful in dev)
                  console.log("[RTE] returning image URL to TinyMCE:", url);
                  return url;
                } catch (err) {
                  console.error("[RTE] TinyMCE image upload failed:", err);
                  // rethrow so Tiny shows an error to the user in the editor
                  throw err;
                }
              },
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
