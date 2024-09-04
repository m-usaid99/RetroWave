import React from 'react';
import styles from './Window.module.css';

function WindowMobile({ title, children, closeWindow, zIndex }) {
  return (
    <div
      className={styles.window}
      styles={{ zIndex: zIndex }}
    >
      <div className={styles.titleBar}>
        <span>{title}</span>
        <button className={styles.closeButton} onClick={closeWindow}>X</button>
      </div>
      {children}
    </div>
  );
}

export default WindowMobile;

