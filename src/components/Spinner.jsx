import React from 'react';
import styles from '../styles/Spinner.module.css';

const GlassmorphicSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div className={`${styles.spinnerLayer} ${styles.spinnerBackground}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerBorder}`}></div>
        <div className={`${styles.spinnerLayer} ${styles.spinnerOverlay}`}></div>
      </div>
    </div>
  );
};

export default GlassmorphicSpinner;