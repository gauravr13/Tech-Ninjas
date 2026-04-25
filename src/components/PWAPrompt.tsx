import { useRegisterSW } from 'virtual:pwa-register/react'

export function PWAPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r)
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="pwa-toast-container">
      {(offlineReady || needRefresh) && (
        <div className="pwa-toast">
          <div className="pwa-message">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>New content available, click on reload button to update.</span>
            )}
          </div>
          <div className="pwa-actions">
            {needRefresh && (
              <button className="pwa-button reload" onClick={() => updateServiceWorker(true)}>
                Reload
              </button>
            )}
            <button className="pwa-button close" onClick={() => close()}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
