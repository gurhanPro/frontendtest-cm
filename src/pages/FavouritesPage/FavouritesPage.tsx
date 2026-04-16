import { useEffect, useState } from "react";
import type { Favourite } from "../../types";
import useAuth from "../../hooks/useAuth";
import { config } from "../../config";
import styles from "./FavouritesPage.module.scss";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`${config.favouritesApiUrl}?userId=${user.id}`);
        const data = await res.json();
        setFavourites(data);
      } catch {
        setError("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [user]);

  const removeFavourite = async (imageUrl: string) => {
    if (!user) return;
    try {
      await fetch(config.favouritesApiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, userId: user.id }),
      });
      setFavourites(prev => prev.filter(fav => fav.imageUrl !== imageUrl));
    } catch {
      setError("Failed to remove favourite");
    }
  };

  if (loading) return <p className={styles.loading}>Loading favourites...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Favourites</h1>
      {favourites.length === 0 ? (
        <p className={styles.empty}>No favourites yet. Go pick some dogs!</p>
      ) : (
        <div className={styles.grid}>
          {favourites.map((fav) => (
            <div key={fav.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={fav.imageUrl} alt="Favourite dog" className={styles.image} />
              </div>
              <button
                onClick={() => removeFavourite(fav.imageUrl)}
                className={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
