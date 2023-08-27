const allData = Symbol('Full data change');
export function createEventEmitter(data) {
    const dataChangeListeners = new Map();
    function addHandler(key, handler) {
        if (!dataChangeListeners.has(key)) {
            dataChangeListeners.set(key, new Set());
        }
        dataChangeListeners.get(key).add(handler);
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
                dataChangeListeners.get(key).delete(handler);
            }
            else {
                dataChangeListeners.delete(key);
            }
        },
        setData(newData, deleteUndefined = false) {
            const oldData = { ...data };
            if (deleteUndefined) {
                Object.keys(data).forEach(key => delete data[key]);
            }
            Object.assign(data, newData);
            for (const property of dataChangeListeners.keys()) {
                if (property === allData) {
                    for (const listener of dataChangeListeners.get(property).values()) {
                        listener({ ...data });
                    }
                }
                else {
                    const dataKey = property;
                    if (oldData[dataKey] !== data[dataKey]) {
                        let result;
                        if (Array.isArray(data[dataKey])) {
                            result = [...data[dataKey]];
                        }
                        else if (data[dataKey] && typeof data[dataKey] === 'object') {
                            result = { ...data[dataKey] };
                        }
                        else {
                            result = data[dataKey];
                        }
                        for (const listener of dataChangeListeners.get(property).values()) {
                            listener(result);
                        }
                    }
                }
            }
        }
    };
}
//# sourceMappingURL=eventEmitter.js.map