import { useEffect, useState } from "react";
import styles from "./FavouritesPage.module.scss";

const API_URL = "http://localhost:3000/api/favourites";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setFavourites(data);
      } catch {
        setError("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const removeFavourite = async (imageUrl: string) => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      setFavourites(data);
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
          {favourites.map((url) => (
            <div key={url} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={url} alt="Favourite dog" className={styles.image} />
              </div>
              <button
                onClick={() => removeFavourite(url)}
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
