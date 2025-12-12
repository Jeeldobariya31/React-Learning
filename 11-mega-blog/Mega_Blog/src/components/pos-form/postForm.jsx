import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appWrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  uploadImageUnsigned,
  deleteByPublicId,
  getPublicIdFromUrl,
  isCloudinaryUrl,
} from "../../utils/cloudinaryClient";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidImageFile = (file) => {
    return (
      file &&
      typeof file === "object" &&
      typeof file.size === "number" &&
      file.size > 0 &&
      typeof file.type === "string" &&
      file.type.startsWith("image/")
    );
  };

  const submit = async (data) => {
    setLoading(true);
    setError("");
    try {
      if (!userData?.$id) {
        throw new Error("Please log in before submitting a post.");
      }
      if (post) {
        // UPDATE FLOW
        let newFeatured = undefined;
        let newFeaturedPublicId = undefined;
        const newImage = isValidImageFile(data.image && data.image[0])
          ? data.image[0]
          : null;

        if (newImage) {
          // 1) delete old image first
          try {
            if (isCloudinaryUrl(post.featuredImage)) {
              const pubId = getPublicIdFromUrl(post.featuredImage);
              if (pubId) await deleteByPublicId(pubId);
            } else if (post.featuredImage) {
              await appwriteService.deleteFile(post.featuredImage);
            }
          } catch (_) {
            // ignore deletion errors
          }

          // 2) Cloudinary upload (store URL only)
          const up = await uploadImageUnsigned(newImage);
          newFeatured = up.secure_url;
          newFeaturedPublicId = up.public_id;
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: newFeatured !== undefined ? newFeatured : post.featuredImage,
          featuredImagePublicId: newFeaturedPublicId !== undefined ? newFeaturedPublicId : post.featuredImagePublicId,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // CREATE FLOW (image optional)
        const image = isValidImageFile(data.image && data.image[0])
          ? data.image[0]
          : null;
        let featuredImageValue = undefined;
        let featuredImagePublicId = undefined;
        if (image) {
          // Cloudinary only: store URL
          const up = await uploadImageUnsigned(image);
          featuredImageValue = up.secure_url;
          featuredImagePublicId = up.public_id;
        }

        const dbPost = await appwriteService.createPost({
          ...data,
          featuredImage: featuredImageValue,
          featuredImagePublicId,
          authorId: userData?.prefs?.authorId,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full flex flex-wrap my-3">
      <div className="w-full px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-full px-2">
        <Input
          label="Featured Image (optional):"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={
                typeof post.featuredImage === "string" && post.featuredImage.startsWith("http")
                  ? post.featuredImage
                  : appwriteService.getFilePreview(post.featuredImage)
              }
              alt={post.title}
              className="rounded-lg"
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
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : post ? "Update" : "Submit"}
        </Button>
        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      </div>
    </form>
  );
}
