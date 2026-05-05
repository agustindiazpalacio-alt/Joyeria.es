import { useState, useEffect } from 'react';
import { AppState } from '../types';
import { initialData } from '../data/initialData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export function useStore() {
  const [state, setLocalState] = useState<AppState>(initialData);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setLoading(true);
        try {
          const loadCol = async <T>(colName: string): Promise<T[]> => {
            try {
              const res = await getDocs(collection(db, `users/${u.uid}/${colName}`));
              // @ts-ignore
              return res.docs.map(doc => { const d = doc.data(); delete d.userId; return d; }) as T[];
            } catch (e: any) {
              // Ignore if missing permissions on new empty
              if (e.message && e.message.includes('permission')) return [];
              handleFirestoreError(e, OperationType.GET, `users/${u.uid}/${colName}`);
              return [];
            }
          };

          const [products, sales, providers, tasks, stockHistory, events, chatSessions] = await Promise.all([
            loadCol<any>('products'),
            loadCol<any>('sales'),
            loadCol<any>('providers'),
            loadCol<any>('tasks'),
            loadCol<any>('stockHistory'),
            loadCol<any>('events'),
            loadCol<any>('chatSessions')
          ]);

          let sd = initialData.startDate;
          try {
            const userDoc = await getDoc(doc(db, `users/${u.uid}`));
            if (userDoc.exists() && userDoc.data()?.startDate) sd = userDoc.data()?.startDate;
          } catch(e) {}

          setLocalState({
            products: products || [],
            sales: sales || [],
            providers: providers || [],
            tasks: tasks || [],
            stockHistory: stockHistory || [],
            events: events || [],
            chatSessions: chatSessions || [],
            startDate: sd || initialData.startDate
          });

        } catch (error) {
           console.error("Store loading error", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLocalState(initialData);
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const syncToFirestore = async (prevState: AppState, newState: AppState, userId: string) => {
     try {
       const batch = writeBatch(db);
       let operations = 0;

       const diffCollection = (colName: string, oldArr: any[], newArr: any[]) => {
          const oldMap = new Map((oldArr || []).map(i => [i.id, i]));
          const newMap = new Map((newArr || []).map(i => [i.id, i]));
          
          for (const [id, item] of newMap.entries()) {
             if (JSON.stringify(item) !== JSON.stringify(oldMap.get(id))) {
                const docRef = doc(db, `users/${userId}/${colName}`, id);
                batch.set(docRef, { ...item, userId });
                operations++;
             }
          }
          for (const [id] of oldMap.entries()) {
             if (!newMap.has(id)) {
                batch.delete(doc(db, `users/${userId}/${colName}`, id));
                operations++;
             }
          }
       };

       diffCollection('products', prevState.products, newState.products);
       diffCollection('sales', prevState.sales, newState.sales);
       diffCollection('providers', prevState.providers, newState.providers);
       diffCollection('tasks', prevState.tasks, newState.tasks);
       diffCollection('stockHistory', prevState.stockHistory, newState.stockHistory);
       diffCollection('events', prevState.events, newState.events);
       // ChatSessions might be added later, skip diffing them here or add them:
       diffCollection('chatSessions', prevState.chatSessions || [], newState.chatSessions || []);

       if (prevState.startDate !== newState.startDate) {
          batch.set(doc(db, `users/${userId}`), { startDate: newState.startDate, userId }, { merge: true });
          operations++;
       }

       if (operations > 0 && operations <= 500) {
          await batch.commit();
       } else if (operations > 500) {
          console.error("Too many operations for a single batch!");
       }

     } catch (e) {
       console.error("Sync error", e);
     }
  };

  const setState = (newStateOrUpdater: any) => {
    setLocalState((prevState) => {
      const newState = typeof newStateOrUpdater === 'function' ? newStateOrUpdater(prevState) : newStateOrUpdater;
      
      if (user) {
         syncToFirestore(prevState, newState, user.uid);
      }
      return newState;
    });
  };

  const resetData = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todos los datos y reiniciar la app?")) {
      setState((prev: AppState) => ({ ...initialData, startDate: prev.startDate }));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'joyaos_backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return { state, setState, resetData, exportData, user, loading };
}
