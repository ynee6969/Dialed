"use client";

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
