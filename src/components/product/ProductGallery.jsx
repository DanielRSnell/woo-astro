import { useState } from 'react';

export default function ProductGallery({ images, productName }) {
  const [currentImage, setCurrentImage] = useState(images[0]?.sourceUrl);

  if (!images?.length) return null;

  return (
    <div class="sticky top-[7rem] space-y-4">
      <div class="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        <img 
          src={currentImage} 
          alt={productName}
          class="h-full w-full object-cover"
        />
      </div>
      
      <div class="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button 
            key={index}
            onClick={() => setCurrentImage(image.sourceUrl)}
            class={`
              relative aspect-square overflow-hidden rounded-lg border bg-muted
              ${currentImage === image.sourceUrl 
                ? 'border-primary ring-2 ring-primary ring-offset-2' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <img 
              src={image.sourceUrl} 
              alt={image.altText || `${productName} view ${index + 1}`}
              class="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
