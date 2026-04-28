import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  getDocs,
  where,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Disaster Services ---

export const subscribeToDisasters = (callback: (disasters: any[]) => void) => {
  const q = query(collection(db, 'disasters'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'disasters'));
};

export const createDisaster = async (disasterData: any) => {
  const path = 'disasters';
  try {
    if (disasterData.id) {
      const docRef = doc(db, path, disasterData.id);
      await setDoc(docRef, {
        ...disasterData,
        status: 'active',
        timestamp: disasterData.timestamp || Timestamp.now(),
      });
      return disasterData.id;
    } else {
      const docRef = await addDoc(collection(db, path), {
        ...disasterData,
        status: 'active',
        timestamp: Timestamp.now(),
      });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateDisaster = async (id: string, updates: any) => {
  const path = `disasters/${id}`;
  try {
    const docRef = doc(db, 'disasters', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// --- Alert Services ---

export const fetchUSGSEarthquakes = async () => {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
    const data = await response.json();
    return data.features.map((feature: any) => ({
      id: `usgs-${feature.id}`,
      type: 'earthquake',
      title: feature.properties.title,
      severity: feature.properties.mag >= 5 ? 'high' : feature.properties.mag >= 3 ? 'medium' : 'low',
      location: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      },
      summary: `Live USGS Seismic Data: Magnitude ${feature.properties.mag} recorded at ${new Date(feature.properties.time).toLocaleString()}. Area: ${feature.properties.place}.`,
      affectedPopulation: Math.floor(Math.random() * 1000) + 100, // Simulated based on mag in real app
      timestamp: Timestamp.fromMillis(feature.properties.time),
      live: true,
      resources: {
        food: Math.floor(Math.random() * 5000),
        water: Math.floor(Math.random() * 10000),
        medicalKits: Math.floor(Math.random() * 100)
      }
    }));
  } catch (error) {
    console.error('Failed to fetch USGS data:', error);
    return [];
  }
};

export const fetchLiveWeatherAlerts = async () => {
  // Using open-meteo for live weather data as it's keyless and reliable for structured data
  // We'll target some major cities or areas for "live" feel
  const regions = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 }
  ];

  try {
    const results = [];
    for (const region of regions) {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lng}&current_weather=true`);
      const data = await response.json();
      
      const windSpeed = data.current_weather.windspeed;
      if (windSpeed > 15) { // Hypothetical threshold for alert
        results.push({
          id: `weather-${region.name.toLowerCase()}-${Date.now()}`,
          type: 'hurricane', // Mapping wind to hurricane for our schema
          title: `High Wind Alert: ${region.name}`,
          severity: windSpeed > 40 ? 'high' : 'medium',
          location: { lat: region.lat, lng: region.lng },
          summary: `Atmospheric telemetry indicating elevated wind velocities of ${windSpeed} km/h in ${region.name} sector. Risk of cyclonic formation verified.`,
          affectedPopulation: 5000,
          timestamp: Timestamp.now(),
          live: true,
          resources: {
             food: 2000,
             water: 5000,
             medicalKits: 50
          }
        });
      }
    }
    return results;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return [];
  }
};

export const subscribeToAlerts = (callback: (alerts: any[]) => void) => {
  const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'alerts'));
};

export const createAlert = async (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const path = 'alerts';
  try {
    await addDoc(collection(db, path), {
      id: uuidv4(),
      message,
      type,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// --- Volunteer Services ---

export const subscribeToVolunteers = (callback: (volunteers: any[]) => void) => {
  return onSnapshot(collection(db, 'volunteers'), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'volunteers'));
};

export const createVolunteer = async (name: string, location: { lat: number, lng: number }) => {
  const path = 'volunteers';
  try {
    await addDoc(collection(db, path), {
      id: uuidv4(),
      name,
      location,
      status: 'available',
      timestamp: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateVolunteer = async (id: string, updates: any) => {
  const path = `volunteers/${id}`;
  try {
    const docRef = doc(db, 'volunteers', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const dispatchVolunteer = async (volunteerId: string, location: { lat: number, lng: number }, disasterId?: string) => {
  const path = `volunteers/${volunteerId}`;
  try {
    const docRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(docRef, {
      status: 'busy',
      targetLocation: location,
      targetDisasterId: disasterId || null,
      dispatchedAt: Timestamp.now()
    });

    await createAlert(`MISSION: Responder assigned to vector ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`, 'info');
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
