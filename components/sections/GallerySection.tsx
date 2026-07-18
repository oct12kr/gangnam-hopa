"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// TODO: 실제 갤러리 사진 8장(01.jpg~08.jpg) /public/images/gallery/ 에 추가되면 플레이스홀더 자동 교체됨
const galleryImages = [
  { id: 1, src: "/images/gallery/01.jpg", alt: "강남보스턴 갤러리 01" },
  { id: 2, src: "/images/gallery/02.jpg", alt: "강남보스턴 갤러리 02" },
  { id: 3, src: "/images/gallery/03.jpg", alt: "강남보스턴 갤러리 03" },
  { id: 4, src: "/images/gallery/04.jpg", alt: "강남보스턴 갤러리 04" },
  { id: 5, src: "/images/gallery/05.jpg", alt: "강남보스턴 갤러리 05" },
  { id: 6, src: "/images/gallery/06.jpg", alt: "강남보스턴 갤러리 06" },
  { id: 7, src: "/images/gallery/07.jpg", alt: "강남보스턴 갤러리 07" },
  { id: 8, src: "/images/gallery/08.jpg", alt: "강남보스턴 갤러리 08" },
];

function GalleryTitleOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`gallery-title-ornament ${className}`} aria-hidden="true">
      <span className="gallery-ornament-line" />
      <span className="gallery-ornament-diamond" />
      <span className="gallery-ornament-line" />
    </div>
  );
}

function GalleryCrest() {
  return (
    <div className="gallery-crest" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function GalleryPlaceholder({ id }: { id: number }) {
  return (
    // Placeholder label is removed automatically once a real gallery image loads.
    <div className="gallery-placeholder">
      <span>{`GALLERY ${String(id).padStart(2, "0")}`}</span>
    </div>
  );
}

export default function GallerySection() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const selectedImage = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;

  const markLoaded = (id: number) => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setLoadedImages((current) => new Set(current).add(id));
  };

  const markFailed = (id: number) => {
    setLoadedImages((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setFailedImages((current) => new Set(current).add(id));
  };

  const moveLightbox = (direction: 1 | -1) => {
    setLightboxIndex((index) => (index === null ? index : (index + direction + galleryImages.length) % galleryImages.length));
  };

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
      if (event.key === "ArrowRight") {
        moveLightbox(1);
      }
      if (event.key === "ArrowLeft") {
        moveLightbox(-1);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex]);

  return (
    <section className="gallery-section" id="gallery" aria-label="BOSTON gallery">
      <Image className="gallery-bg-image" src="/images/gallery/555.png" alt="" fill sizes="100vw" />
      <div className="gallery-bg-wash" aria-hidden="true" />

      <div className="gallery-inner">
        <header className="gallery-heading">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <GalleryCrest />
          </motion.div>
          <motion.div
            className="gallery-title-row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <GalleryTitleOrnament />
            <h2>GALLERY</h2>
            <GalleryTitleOrnament />
          </motion.div>
          <motion.p
            className="gallery-subcopy"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            강남보스턴의 프리미엄 공간을 소개합니다.
          </motion.p>
        </header>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => {
            const hasLoaded = loadedImages.has(image.id) && !failedImages.has(image.id);

            return (
              <button
                className="gallery-item"
                type="button"
                key={image.id}
                onClick={() => setLightboxIndex(index)}
                aria-label={`${image.alt} 확대 보기`}
              >
                <motion.div
                  className="gallery-item-motion"
                  initial={{ opacity: 0, y: 28, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                >
                  <GalleryPlaceholder id={image.id} />
                  <Image
                    className={hasLoaded ? "gallery-photo is-loaded" : "gallery-photo"}
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1025px) 24vw, (min-width: 768px) 48vw, 92vw"
                    onLoad={() => markLoaded(image.id)}
                    onError={() => markFailed(image.id)}
                  />
                  <span className="gallery-item-overlay" aria-hidden="true" />
                  <span className="gallery-zoom-icon" aria-hidden="true">
                    <Maximize2 size={24} strokeWidth={1.6} />
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedImage ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="갤러리 이미지 확대" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" type="button" aria-label="닫기" onClick={() => setLightboxIndex(null)}>
            <X size={22} strokeWidth={1.6} />
          </button>
          <button
            className="lightbox-nav prev"
            type="button"
            aria-label="이전 이미지"
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(-1);
            }}
          >
            <ChevronLeft size={26} strokeWidth={1.6} />
          </button>
          <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <GalleryPlaceholder id={selectedImage.id} />
            {!failedImages.has(selectedImage.id) ? (
              <Image
                className={loadedImages.has(selectedImage.id) ? "gallery-photo is-loaded" : "gallery-photo"}
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                onLoad={() => markLoaded(selectedImage.id)}
                onError={() => markFailed(selectedImage.id)}
              />
            ) : null}
          </figure>
          <button
            className="lightbox-nav next"
            type="button"
            aria-label="다음 이미지"
            onClick={(event) => {
              event.stopPropagation();
              moveLightbox(1);
            }}
          >
            <ChevronRight size={26} strokeWidth={1.6} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
