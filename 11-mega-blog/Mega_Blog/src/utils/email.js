/**
 * ===================================================
 * EMAIL UTIL (EmailJS)
 * ---------------------------------------------------
 * Handles:
 *  - Signup welcome email
 *  - Article create email
 *  - Article update email
 *  - Article delete email
 *
 * SAFE FOR FRONTEND (Vite + React)
 * ===================================================
 */

import emailjs from "@emailjs/browser";

/* ===========================
   ENV VARIABLES (VITE ONLY)
   =========================== */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const TEMPLATE_WELCOME = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME;
const TEMPLATE_ARTICLE = import.meta.env.VITE_EMAILJS_TEMPLATE_ARTICLE;

/* ===========================
   VALIDATION
   =========================== */
if (!SERVICE_ID || !PUBLIC_KEY) {
  console.warn("⚠️ EmailJS env variables missing");
}

/* ===========================
   BASE SEND FUNCTION
   =========================== */
const sendEmail = async (templateId, params) => {
  if (!templateId) {
    console.error("❌ Missing EmailJS template ID");
    return { success: false };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      templateId,
      params,
      PUBLIC_KEY
    );

    console.log("📧 Email sent:", templateId, result.status);
    return { success: true };
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
    return { success: false, error };
  }
};

/* ===================================================
   1️⃣ SIGNUP EMAIL
   =================================================== */
export const sendSignupEmail = async ({ name, email }) => {
  return sendEmail(TEMPLATE_WELCOME, {
    name,
    email,
    app_name: "Blogzilla",
    app_url: "https://blogzilla.vercel.app",
    year: new Date().getFullYear(),
  });
};

/* ===================================================
   2️⃣ ARTICLE CREATE EMAIL
   =================================================== */
export const sendArticleCreateEmail = async ({
  title,
  status,
  authorName,
  authorEmail,
}) => {
  return sendEmail(TEMPLATE_ARTICLE, {
    action: "Created",
    title,
    status,
    name: authorName,
    email: authorEmail,
  });
};

/* ===================================================
   3️⃣ ARTICLE UPDATE EMAIL
   =================================================== */
export const sendArticleUpdateEmail = async ({
  title,
  status,
  authorName,
  authorEmail,
}) => {
  return sendEmail(TEMPLATE_ARTICLE, {
    action: "Updated",
    title,
    status,
    name: authorName,
    email: authorEmail,
  });
};

/* ===================================================
   4️⃣ ARTICLE DELETE EMAIL
   =================================================== */
export const sendArticleDeleteEmail = async ({
  title,
  authorName,
  authorEmail,
}) => {
  return sendEmail(TEMPLATE_ARTICLE, {
    action: "Deleted",
    title,
    status: "deleted",
    name: authorName,
    email: authorEmail,
  });
};
