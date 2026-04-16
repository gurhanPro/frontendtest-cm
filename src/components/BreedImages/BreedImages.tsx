import { useEffect, useState } from "react";
import type { BreedType } from "../../types";

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


  return <div>
    <h2>selected breed: {selectedBreed?.name}</h2>
    {loading && <p>Loading images...</p>}
    {error && <p>{error}</p>}
    {selectedBreed ? selectedBreedImages.map(imageUrl => <img key={imageUrl} src={imageUrl} alt={selectedBreed?.name} />) : 'No selected breed yet'}
  </div>;
}
