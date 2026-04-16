import { useEffect, useState, useRef } from "react";
import type { BreedType } from "../../types";
import styles from "./BreedImages.module.scss";

const FAVOURITES_API = "http://localhost:3000/api/favourites";

export default function BreedImages({ selectedBreed }: { selectedBreed: BreedType | null }) {
  const [selectedBreedImages, setSelectedBreedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<string[]>([])
  const cache = useRef(new Map<string, string[]>())

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(FAVOURITES_API)
        const data = await res.json()
        setFavourites(data)
      } catch {
        setError("Failed to load favourites")
      }
    }
    fetchFavourites()
  }, [])

  const toggleFavourite = async (imageUrl: string) => {
    const isFav = favourites.includes(imageUrl)
    try {
      const res = await fetch(FAVOURITES_API, {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })
      const data = await res.json()
      setFavourites(data)
    } catch {
      setError("Failed to update favourite")
    }
  }

  useEffect(() => {
    if (!selectedBreed) return

    if (cache.current.has(selectedBreed.name)) {
      setSelectedBreedImages(cache.current.get(selectedBreed.name)!)
      return
    }

    const fetch3RandomImages = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed.name}/images/random/3`)
        const resBody = await res.json()
        cache.current.set(selectedBreed.name, resBody.message)
        setSelectedBreedImages(resBody.message)
      } catch {
        setError('error loading images')
      } finally {
        setLoading(false)
      }
    }

    fetch3RandomImages()
  }, [selectedBreed])


  if (!selectedBreed) return <div className={styles.container}><p className={styles.empty}>Select a breed to view images</p></div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{selectedBreed.name}</h2>
      {loading && <p className={styles.loading}>Loading images...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {selectedBreedImages.map(imageUrl => (
          <div key={imageUrl} className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <img src={imageUrl} alt={selectedBreed.name} className={styles.image} />
            </div>
            <button
              onClick={() => toggleFavourite(imageUrl)}
              className={`${styles.favBtn} ${favourites.includes(imageUrl) ? styles.favourited : ''}`}
            >
              {favourites.includes(imageUrl) ? "Remove Favourite" : "Add Favourite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
