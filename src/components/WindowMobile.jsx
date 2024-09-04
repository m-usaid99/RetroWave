import React from 'react';
import styles from './Window.module.css';

function WindowMobile({ title, children, closeWindow }) {
  return (
    <div
      className={styles.window}
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

