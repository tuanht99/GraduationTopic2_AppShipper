import { db } from './config';
import { doc, updateDoc } from 'firebase/firestore';

export const UpdateShipper = async (id, data) => {
    const frankDocRef = doc(db, 'shippers', id);
    await updateDoc(frankDocRef, data);
};
