import React from 'react';
import { X, Bell, Info } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import styles from './NotificationCenter.module.css';

export default function NotificationCenter() {
  const {
    notificationCenterOpen,
    setNotificationCenterOpen,
    notifications,
    dismissNotification,
  } = useDesktopStore();

  if (!notificationCenterOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setNotificationCenterOpen(false)}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Bell size={16} className={styles.accentIcon} />
            <span className={styles.title}>NOTIFICATIONS</span>
          </div>
          <button
            onClick={() => setNotificationCenterOpen(false)}
            className={styles.closeBtn}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.list}>
          {notifications.length === 0 ? (
            <div className={styles.empty}>NO UNREAD NOTIFICATIONS</div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemTop}>
                  <div className={styles.itemHeaderLeft}>
                    <Info size={13} className={styles.accentIcon} />
                    <span className={styles.itemTitle}>{item.title}</span>
                  </div>
                  <div className={styles.itemHeaderRight}>
                    <span className={styles.itemTime}>{item.time}</span>
                    <button
                      onClick={() => dismissNotification(item.id)}
                      className={styles.dismissBtn}
                      title="Dismiss"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <div className={styles.itemMessage}>{item.message}</div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
