//Manejo del localStorage


export const storage = {
    get(key) { // traer algo de localStorage
        try {
            const getStorage = localStorage.getItem(key)
            return getStorage ? JSON.parse(getStorage) : null
        } catch { return null }
    },
    set(key, value) {//guardar algo en localStorage
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {}
    },
    remove(key) { // elimina algo del localStorage
        try {
            localStorage.removeItem(key)
        } catch {}   
        },
        clear() {// limpia totalmente el localStorage
            try {
                localStorage.clear()
            } catch {}
        }
    }
