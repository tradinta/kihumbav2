import { useState, useEffect } from 'react';

export interface GeolocationState {
    loading: boolean;
    error: string | null;
    coords: {
        latitude: number;
        longitude: number;
    } | null;
    granted: boolean;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null,
        coords: null,
        granted: false,
    });

    const getPosition = () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: 'Geolocation not supported' 
            }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState({
                    loading: false,
                    error: null,
                    coords: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    },
                    granted: true,
                });
            },
            (err) => {
                setState({
                    loading: false,
                    error: err.message,
                    coords: null,
                    granted: false,
                });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    // Check permission status on mount
    useEffect(() => {
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then(status => {
                if (status.state === 'granted') {
                    getPosition();
                }
                status.onchange = () => {
                    if (status.state === 'granted') getPosition();
                    else if (status.state === 'denied') {
                        setState(prev => ({ ...prev, granted: false, coords: null }));
                    }
                };
            });
        }
    }, []);

    return { ...state, getPosition };
}
