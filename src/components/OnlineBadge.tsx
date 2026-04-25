import { useModeStore } from '../state/modeStore'

/**
 * ONLINE STATUS BADGE
 * An animated indicator that tells the user if the app is currently 
 * connected to the internet or working in offline mode.
 */
export function OnlineBadge() {
  // Listen to the global 'isOnline' state
  const isOnline = useModeStore((state) => state.isOnline)

  return (
    <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
      {/* Animated Dot */}
      <span className="dot"></span>
      {/* Dynamic Text */}
      <span className="text">{isOnline ? 'Online' : 'Offline Mode'}</span>
    </div>
  )
}
