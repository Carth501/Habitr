import { create } from 'zustand';

interface DataStoreState {
	user: string;
	setUser: (data: string) => void;
}

const useDataStore = create<DataStoreState>((set) => ({
	user: '',
	setUser: (data: string) => {
		set({ user: data });
	},
}));

export default useDataStore;
