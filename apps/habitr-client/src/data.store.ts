import { create } from 'zustand';

export interface Habit {
	id: number;
	title: string;
	description: string;
	progress: number;
	frequency: 'Daily' | 'Weekly';
	created: string;
	suspended?: boolean;
	last_done?: string;
	entryCount?: number;
}

interface DataStoreState {
	user: string;
	setUser: (data: string) => void;
	habits: Habit[];
	setHabits: (data: Habit[]) => void;
}

const useDataStore = create<DataStoreState>((set) => ({
	user: '',
	setUser: (data: string) => {
		set({ user: data });
	},
	habits: [],
	setHabits: (data: Habit[]) => {
		set({ habits: data });
	},
}));

export default useDataStore;
