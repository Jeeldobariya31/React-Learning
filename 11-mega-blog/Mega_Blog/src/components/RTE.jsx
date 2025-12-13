import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import appwriteService from "../appWrite/config";

/**
 * Fully‑featured Rich Text Editor (TinyMCE)
 * - Images / Media upload via Appwrite
 * - Tables, code, fullscreen, preview
 * - Autosave, paste cleanup, wordcount
 * - Links, lists, formatting, colors
 */
export default function RTE({
  name = "content",
  control,
  label,
  defaultValue = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 font-medium">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINY_KEY}
            value={value}
            initialValue={defaultValue}
            onEditorChange={onChange}
            init={{
              height: 500,
              menubar: true,
              branding: false,

              /* ================= Plugins ================= */
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "media",
                "table",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "wordcount",
                "help",
                "autosave",
                "quickbars",
                "emoticons",
                "codesample",
              ],

              /* ================= Toolbar ================= */
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | " +
                "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                "link image media table | codesample code preview fullscreen | removeformat help",

              /* ================= Quick Toolbar ================= */
              quickbars_selection_toolbar:
                "bold italic | quicklink h2 h3 blockquote",
              quickbars_insert_toolbar: "quickimage quicktable",

              /* ================= Styling ================= */
              content_style:
                "body { font-family: Inter, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }",

              /* ================= Paste Handling ================= */
              paste_as_text: false,
              paste_auto_cleanup_on_paste: true,
              paste_remove_styles: false,
              paste_remove_spans: false,

              /* ================= Autosave ================= */
              autosave_interval: "30s",
              autosave_retention: "2m",

              /* ================= Image Upload ================= */
              automatic_uploads: true,
              images_upload_handler: async (blobInfo) => {
                try {
                  const file = blobInfo.blob();
                  const uploaded = await appwriteService.uploadFile(file);
                  const preview = await appwriteService.getFilePreview(
                    uploaded.$id
                  );

                  const url =
                    preview && typeof preview === "object" && preview.href
                      ? preview.href
                      : typeof preview === "string"
                      ? preview
                      : null;

                  if (!url || !/^https?:\/\//i.test(url)) {
                    throw new Error("Invalid image URL returned from Appwrite");
                  }

                  return url;
                } catch (err) {
                  console.error("[RTE] Image upload failed:", err);
                  throw err;
                }
              },

              /* ================= Link ================= */
              link_default_target: "_blank",
              link_rel_list: [
                { title: "None", value: "" },
                { title: "No Follow", value: "nofollow" },
              ],

              /* ================= Tables ================= */
              table_default_attributes: { border: "1" },
              table_default_styles: { width: "100%" },

              /* ================= Media ================= */
              media_live_embeds: true,

              /* ================= Accessibility ================= */
              a11y_advanced_options: true,
            }}
          />
        )}
      />
    </div>
  );
}
