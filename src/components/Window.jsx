import { Rnd } from 'react-rnd';
import styles from './Window.module.css';

function Window({ title, children, width, height, x, y, zIndex, closeWindow, bringToFront, updatePositionAndSize }) {
  return (
    <Rnd
      position={{ x, y }}  // Bind position to state
      size={{ width, height }}
      minWidth={150}
      minHeight={100}
      bounds="parent"
      dragHandleClassName={styles.titleBar}
      style={{ zIndex: zIndex, position: 'absolute' }}
      className={styles.window}
      onMouseDown={bringToFront}
      onDragStop={(e, d) => {
        updatePositionAndSize(d.x, d.y, width, height);  // Update position in state when dragging stops
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updatePositionAndSize(position.x, position.y, ref.style.width, ref.style.height);  // Update position and size after resizing
      }}
    >
      <div className={styles.titleBar}>
        <span>{title}</span>
        <button className={styles.closeButton} onClick={closeWindow}>X</button>
      </div>
      <div className={styles.contentWrapper}>
        {children} {/* Content goes here, inside the white box with grey border */}
      </div>
    </Rnd>
  );
}

export default Window;

