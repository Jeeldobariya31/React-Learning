import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appWrite";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ✅ EMAIL IMPORT (ADDED) */
import {
  sendArticleCreateEmail,
  sendArticleUpdateEmail,
} from "../../utils/email";

/**
 * PostForm
 * --------------------------------------------------
 * Used for:
 * - Creating a new post
 * - Editing an existing post
 *
 * Handles:
 * - Slug generation
 * - Image upload / replace
 * - Image cleanup (delete old image)
 * - Create vs Update logic
 * - 📧 Email notifications (ADDED)
 */
export default function PostForm({ post }) {
  /* =========================
     FORM SETUP
     ========================= */
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     HELPERS
     ========================= */

  const isValidImageFile = (file) =>
    file instanceof File && file.type.startsWith("image/");

  const slugTransform = useCallback((value = "") => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }, []);

  /* =========================
     AUTO SLUG FROM TITLE
     ========================= */
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  /* =========================
     SUBMIT HANDLER
     ========================= */
  const submit = async (data) => {
    setLoading(true);
    setError("");

    try {
      if (!userData?.$id) {
        throw new Error("You must be logged in");
      }

      /* =========================
         IMAGE LOGIC
         ========================= */
      let featuredImageId = post?.featuredImage || null;

      const newImage =
        data.image && isValidImageFile(data.image[0]) ? data.image[0] : null;

      if (newImage) {
        if (post?.featuredImage) {
          await appwriteService.deleteImage(post.featuredImage);
        }

        const uploaded = await appwriteService.uploadImage(
          newImage,
          userData.$id
        );

        featuredImageId = uploaded.$id;
      }

      /* =========================
         UPDATE POST
         ========================= */
      if (post) {
        const updated = await appwriteService.updatePost(post.$id, {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: featuredImageId,
        });

        /* 📧 EMAIL ON UPDATE (ADDED) */
        sendArticleUpdateEmail({
          title: updated.title,
          status: updated.status,
          authorName: userData.name,
          authorEmail: userData.email,
        }).catch(() => console.warn("Update email failed"));

        navigate(`/post/${updated.slug}`);
        return;
      }

      /* =========================
         CREATE POST
         ========================= */
      const created = await appwriteService.createPost(
        {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: featuredImageId,
        },
        userData
      );

      /* 📧 EMAIL ON CREATE (ADDED) */
      sendArticleCreateEmail({
        title: created.title,
        status: created.status,
        authorName: userData.name,
        authorEmail: userData.email,
      }).catch(() => console.warn("Create email failed"));

      navigate(`/post/${created.slug}`);
    } catch (err) {
      console.error("❌ Post submit failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full flex flex-wrap my-3"
    >
      {/* LEFT COLUMN */}
      <div className="w-full px-2">
        <Input
          label="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full px-2">
        <Input
          label="Featured Image (optional)"
          type="file"
          accept="image/*"
          className="mb-4"
          {...register("image")}
        />

        {post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getImageUrl(post.featuredImage)}
              alt={post.title}
              className="rounded-lg max-h-64 object-contain"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          className="w-full"
          bgColor={post ? "bg-green-500" : undefined}
          disabled={loading}
        >
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>

        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      </div>
    </form>
  );
}
