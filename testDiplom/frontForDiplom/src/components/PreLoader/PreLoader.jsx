import React, { useRef, useState } from 'react';
import './preloader.css';

/**
 * Логотип загрузки, пока не загрузиться сайт.
 *
 * @return возвращает разметку.
 */
const PreLoader = () => {
  const viewRef = useRef();

  useState(() => {
    return () => {
      viewRef.current.style.opacity = 0;
    };
  }, []);

  return (
    <div ref={viewRef} className="preloader">
      <div className="preloader__image_animate"></div>
    </div>
  );
};

export default PreLoader;
