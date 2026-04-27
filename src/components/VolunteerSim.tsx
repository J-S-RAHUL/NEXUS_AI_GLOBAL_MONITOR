import { useEffect } from 'react';
import { updateVolunteer } from '../services/dataService';

interface VolunteerSimProps {
  volunteers: any[];
}

export default function VolunteerSim({ volunteers }: VolunteerSimProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      volunteers.forEach(async (v) => {
        if (v.status === 'busy' && v.targetLocation) {
          const latDiff = v.targetLocation.lat - v.location.lat;
          const lngDiff = v.targetLocation.lng - v.location.lng;
          
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
          
          if (distance < 0.05) {
            // Arrived
            await updateVolunteer(v.id, {
              status: 'available',
              location: v.targetLocation,
              targetLocation: null,
              targetDisasterId: null
            });
          } else {
            // Move towards target
            const step = 0.01;
            const newLat = v.location.lat + (latDiff / distance) * step;
            const newLng = v.location.lng + (lngDiff / distance) * step;
            
            await updateVolunteer(v.id, {
              location: { lat: newLat, lng: newLng }
            });
          }
        }
      });
    }, 5000); // Update every 5 seconds for simulation feel

    return () => clearInterval(interval);
  }, [volunteers]);

  return null;
}
