import { useModeStore } from '../state/modeStore'

export function OnlineBadge() {
  const isOnline = useModeStore((state) => state.isOnline)

  return (
    <div className={`online-badge ${isOnline ? 'online' : 'offline'}`}>
      <span className="dot"></span>
      <span className="label">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  )
}
