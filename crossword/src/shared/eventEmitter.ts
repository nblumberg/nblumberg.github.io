interface DataChangeHandler<T> {
  (data: any): void;
}

interface AddListener<T> {
  (handler: DataChangeHandler<T>): T;
}

interface AddPropertyListener<T> {
  <P extends keyof T>(property: P, handler: DataChangeHandler<T>): T[P];
}

interface RemoveListener<T> {
  <P extends keyof T>(handler?: DataChangeHandler<T>, property?: P): void;
}

interface SetData<T> {
  (data: Partial<T>, deleteUndefined?: boolean): void;
}

const allData = Symbol('Full data change');

export function createEventEmitter<T>(data: T): {
  addListener: AddListener<T>,
  addPropertyListener: AddPropertyListener<T>,
  removeListener: RemoveListener<T>,
  setData: SetData<T>
} {
  const dataChangeListeners = new Map<keyof T | typeof allData, Set<DataChangeHandler<T>>>();

  function addHandler(key: keyof T | typeof allData, handler: DataChangeHandler<T>): void {
    if (!dataChangeListeners.has(key)) {
      dataChangeListeners.set(key, new Set());
    }
    dataChangeListeners.get(key)!.add(handler);
  }

  return {
    addListener(handler) {
      addHandler(allData, handler);
      return { ...data };
    },

    addPropertyListener(property, handler) {
      addHandler(property, handler);
      return data[property];
    },

    removeListener(handler, property) {
      const key = property || allData;
      if (!dataChangeListeners.has(key)) {
        return;
      }
      if (handler) {
        dataChangeListeners.get(key)!.delete(handler);
      } else {
        dataChangeListeners.delete(key);
      }
    },

    setData(newData, deleteUndefined = false) {
      const oldData = { ...data };
      if (deleteUndefined) {
        Object.keys(data as object).forEach(key => delete data[key as keyof T]);
      }
      Object.assign(data as object, newData);
      for (const property of dataChangeListeners.keys()) {
        if (property === allData) {
          for (const listener of dataChangeListeners.get(property)!.values()) {
            listener({ ...data });
          }
        } else {
          const dataKey = property as keyof T;
          if (oldData[dataKey] !== data[dataKey]) {
            let result: any;
            if (Array.isArray(data[dataKey])) {
              result = [...(data[dataKey] as any[])];
            } else if (data[dataKey] && typeof data[dataKey] === 'object') {
              result = { ...(data[dataKey] as object) };
            } else {
              result = data[dataKey];
            }
            for (const listener of dataChangeListeners.get(property)!.values()) {
              listener(result);
            }
          }
        }
      }
    }
  };
}
