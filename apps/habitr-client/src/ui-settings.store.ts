import { create } from 'zustand';

interface UiSettingsStoreState {
    darkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (mode: boolean) => void;
}

const localStorageKey = 'darkMode';
  
const useUiSettingsStore = create<UiSettingsStoreState>((set, get) => ({
    darkMode: localStorage.getItem(localStorageKey) === 'true',
    toggleDarkMode: () => { 
        const { darkMode, setDarkMode} = get();
        setDarkMode(!darkMode);
    },
    setDarkMode: (darkMode: boolean) => {
        localStorage.setItem(localStorageKey, darkMode.toString());
        set({ darkMode })

    }
}));
  
export default useUiSettingsStore;