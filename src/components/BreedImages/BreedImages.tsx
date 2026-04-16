import { useEffect, useState } from "react";
import type { BreedType } from "../../types";
import styles from "./BreedImages.module.scss";

export default function BreedImages({ selectedBreed }: { selectedBreed: BreedType | null }) {
  const [selectedBreedImages, setSelectedBreedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch3RandomImages = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed?.name}/images/random/3`)
        const resBody = await res.json()
        
        setSelectedBreedImages(resBody.message)
      } catch {
        setError('error loading images ')
      }
      finally {
        setLoading(false)

      }

    }

    if (selectedBreed) {
      fetch3RandomImages()
    }

  }, [selectedBreed])


  if (!selectedBreed) return <div className={styles.container}><p className={styles.empty}>Select a breed to view images</p></div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{selectedBreed.name}</h2>
      {loading && <p className={styles.loading}>Loading images...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {selectedBreedImages.map(imageUrl => (
          <div key={imageUrl} className={styles.imageWrapper}>
            <img src={imageUrl} alt={selectedBreed.name} className={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
}
