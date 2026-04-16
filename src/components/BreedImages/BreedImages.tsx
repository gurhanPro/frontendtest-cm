import React, { useEffect, useState } from "react";
import type { BreedType } from "../../types";

export default function BreedImages({ selectedBreed }: { selectedBreed: BreedType | null }) {
  const [selectedBreedImages, setSelectedBreedImages] = useState([])

  useEffect(() => {
    const fetch3RandomImages = async () => {
      const res = await fetch(`https://dog.ceo/api/breed/${selectedBreed?.name}/images/random/3`)
      const resBody = await res.json()
      console.log('images : ', resBody)
      setSelectedBreedImages(resBody.message)
    }

    if (selectedBreed) {
      fetch3RandomImages()
    }

  }, [selectedBreed])


  return <div>
    <h2>selected breed: {selectedBreed?.name}</h2>
    {selectedBreedImages.map(img => <img src={img} />)}
  </div>;
}
