export const network = {
    isOnline: () => navigator.onLine,
    
    // Escuta quando a internet volta
    onReconnect: (callback) => {
        window.addEventListener('online', callback);
    }
};