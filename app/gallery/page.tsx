/**
 * ===================================
 * GALLERY PAGE (Redirect)
 * ===================================
 * 
 * Purpose: Legacy redirect page.
 * Old app had separate "gallery" page, now merged into dashboard.
 * 
 * Behavior: Automatically redirects any traffic to /gallery → /dashboard
 * This maintains backward compatibility if old links are shared.
 * 
 * Result: Clean URL structure, unified browsing experience.
 */

import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function GalleryPage() {
  void styles;

  /* Immediately redirect to dashboard
     No UI is shown - pure server-side redirect */
  redirect("/dashboard");
}
