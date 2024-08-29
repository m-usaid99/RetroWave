import { Rnd } from 'react-rnd';
import styles from './Window.module.css';

function Window({ title, children, width, height, x, y, zIndex, closeWindow, bringToFront, updatePosition }) {
  return (
    <Rnd
      position={{ x, y }}  // Bind position to state
      size={{ width, height }}
      minWidth={150}
      minHeight={100}
      bounds="parent"
      style={{ zIndex: zIndex, position: 'absolute' }}
      className={styles.window}
      onMouseDown={bringToFront}
      onDragStop={(e, d) => {
        updatePosition(d.x, d.y);  // Update position in state when dragging stops
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updatePosition(position.x, position.y);  // Ensure position is updated after resizing
      }}
    >
      <div>
        <div className={styles.titleBar}>
          <span>{title}</span>
          <button className={styles.closeButton} onClick={closeWindow}>X</button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </Rnd>
  );
}

export default Window;

