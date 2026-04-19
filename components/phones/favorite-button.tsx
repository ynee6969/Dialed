"use client";

/**
 * ===================================
 * FAVORITE BUTTON
 * ===================================
 *
 * Purpose:
 * Encapsulates the save/remove interaction for a phone.
 *
 * Why this component matters:
 * - Keeps button visuals consistent in cards and detail pages.
 * - Reads favorite state from the shared provider instead of each page reimplementing it.
 */
import { Heart, LoaderCircle } from "lucide-react";

import { useFavorites } from "@/components/providers/favorites-provider";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  phoneId: string;
  variant?: "icon" | "full";
  className?: string;
}

export function FavoriteButton({
  phoneId,
  variant = "icon",
  className
}: FavoriteButtonProps) {
  /* Provider helpers keep the button tied to the current authenticated account only. */
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const saved = isFavorite(phoneId);
  const pending = isPending(phoneId);

  return (
    <button
      type="button"
      className={`${styles.button} ${saved ? styles.active : ""} ${variant === "full" ? styles.full : ""} ${className ?? ""}`.trim()}
      onClick={() => void toggleFavorite(phoneId)}
      aria-pressed={saved}
      disabled={pending}
    >
      {pending ? <LoaderCircle size={16} className="spin" /> : <Heart size={16} fill={saved ? "currentColor" : "none"} />}
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
