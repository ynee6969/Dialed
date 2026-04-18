"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface FavoritesContextValue {
  favoriteIds: string[];
  favoritesCount: number;
  favoritesReady: boolean;
  isFavorite: (phoneId: string) => boolean;
  isPending: (phoneId: string) => boolean;
  toggleFavorite: (phoneId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function buildCallbackUrl(pathname: string | null) {
  const basePath = pathname || "/dashboard";
  const query = typeof window !== "undefined" ? window.location.search : "";

  return query ? `${basePath}${query}` : basePath;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      setFavoritesReady(false);
      return;
    }

    if (status === "unauthenticated" || !userId) {
      setFavoriteIds([]);
      setPendingIds([]);
      setFavoritesReady(true);
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    setFavoritesReady(false);
    setPendingIds([]);

    void fetch("/api/favorites", {
      signal: controller.signal,
      cache: "no-store"
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load favorites.");
        }

        return response.json();
      })
      .then((data) => {
        if (ignore) {
          return;
        }

        setFavoriteIds(data.favoritePhoneIds ?? []);
      })
      .catch(() => {
        if (!ignore) {
          setFavoriteIds([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setFavoritesReady(true);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [status, userId]);

  async function toggleFavorite(phoneId: string) {
    const callbackUrl = buildCallbackUrl(pathname);

    if (status !== "authenticated") {
      window.location.assign(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (pendingIds.includes(phoneId)) {
      return;
    }

    const currentlyFavorite = favoriteIds.includes(phoneId);

    setPendingIds((current) => [...current, phoneId]);
    setFavoriteIds((current) => {
      if (currentlyFavorite) {
        return current.filter((currentId) => currentId !== phoneId);
      }

      if (current.includes(phoneId)) {
        return current;
      }

      return [...current, phoneId];
    });

    try {
      const response = await fetch(currentlyFavorite ? `/api/favorites/${phoneId}` : "/api/favorites", {
        method: currentlyFavorite ? "DELETE" : "POST",
        headers: currentlyFavorite
          ? undefined
          : {
              "Content-Type": "application/json"
            },
        body: currentlyFavorite ? undefined : JSON.stringify({ phoneId })
      });

      if (response.status === 401) {
        window.location.assign(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        throw new Error("Authentication required.");
      }

      if (!response.ok) {
        throw new Error("Favorite update failed.");
      }
    } catch (error) {
      console.error("[favorites.toggle]", error);
      setFavoriteIds((current) => {
        if (currentlyFavorite) {
          return current.includes(phoneId) ? current : [...current, phoneId];
        }

        return current.filter((currentId) => currentId !== phoneId);
      });
    } finally {
      setPendingIds((current) => current.filter((currentId) => currentId !== phoneId));
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoritesCount: favoriteIds.length,
        favoritesReady,
        isFavorite: (phoneId) => favoriteIds.includes(phoneId),
        isPending: (phoneId) => pendingIds.includes(phoneId),
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider.");
  }

  return context;
}
