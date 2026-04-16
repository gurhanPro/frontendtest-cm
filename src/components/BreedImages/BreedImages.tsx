import { useEffect, useState, useRef } from "react";
import type { BreedType, Favourite } from "../../types";
import useAuth from "../../hooks/useAuth";
import { config } from "../../config";
import styles from "./BreedImages.module.scss";

export default function BreedImages({ selectedBreed }: { selectedBreed: BreedType | null }) {
  const [selectedBreedImages, setSelectedBreedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<Favourite[]>([])
  const cache = useRef(new Map<string, string[]>())
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`${config.favouritesApiUrl}?userId=${user.id}`)
        const data = await res.json()
        setFavourites(data)
      } catch {
        setError("Failed to load favourites")
      }
    }
    fetchFavourites()
  }, [user])

  const isFavourited = (imageUrl: string) => {
    return favourites.some(fav => fav.imageUrl === imageUrl)
  }

  const toggleFavourite = async (imageUrl: string) => {
    if (!user) return
    try {
      if (isFavourited(imageUrl)) {
        await fetch(config.favouritesApiUrl, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl, userId: user.id }),
        })
        setFavourites(prev => prev.filter(fav => fav.imageUrl !== imageUrl))
      } else {
        const res = await fetch(config.favouritesApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl, userId: user.id }),
        })
        const data = await res.json()
        setFavourites(prev => [...prev, data])
      }
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
        const res = await fetch(`${config.dogApiUrl}/breed/${selectedBreed.name}/images/random/3`)
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
              className={`${styles.favBtn} ${isFavourited(imageUrl) ? styles.favourited : ''}`}
            >
              {isFavourited(imageUrl) ? "Remove Favourite" : "Add Favourite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
