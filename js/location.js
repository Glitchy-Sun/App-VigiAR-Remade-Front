export const getLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject("Geolocalização não suportada");
        
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(err)
        );
    });
};