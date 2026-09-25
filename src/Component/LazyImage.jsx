import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LazyImage = ({ src, alt, className = '', style, decoding = 'async' }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className={"relative overflow-hidden " + className} style={style}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-0'
          />
        )}
      </AnimatePresence>

      {isIntersecting && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={"w-full h-full object-cover " + className}
          style={style}
          decoding={decoding}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default React.memo(LazyImage);
