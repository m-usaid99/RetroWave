/* eslint-disable react/prop-types */
import styles from './Sidebar.module.css';

const Sidebar = ({ onTextClick }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarItem} onClick={() => onTextClick('home')}>Home</div>
      <div className={styles.sidebarItem} onClick={() => onTextClick('media')}>Media Player</div>
      <div className={styles.sidebarItem} onClick={() => onTextClick('settings')}>Settings</div>
      <div className={styles.sidebarItem} onClick={() => onTextClick('visualizer')}>Visualizer</div>
      <div className={styles.sidebarItem} onClick={() => onTextClick('about')}>About</div>
      {/* Add more items as needed */}
    </div>
  );
};

export default Sidebar;

