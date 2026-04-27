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
  where
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
    const docRef = await addDoc(collection(db, path), {
      ...disasterData,
      status: 'active',
      timestamp: Timestamp.now(),
    });
    return docRef.id;
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
