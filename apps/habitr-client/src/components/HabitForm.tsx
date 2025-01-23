import { Frequency } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import useDataStore, { Habit } from '@/data.store';
import React from 'react';

interface HabitFormProps {
	newHabit: Habit;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	handleFreqChange: (value: Frequency) => void;
	addHabit: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
	newHabit,
	handleInputChange,
	handleFreqChange,
	addHabit,
}) => {
	const { titleError, setTitleError } = useDataStore();

	const handleAddHabit = () => {
		if (!newHabit.title?.trim()) {
			setTitleError(true);
		} else {
			setTitleError(false);
			addHabit();
		}
	};

	return (
		<TableRow>
			<TableCell>
				<Button onClick={handleAddHabit}>Add Habit</Button>
			</TableCell>
			<TableCell>
				<Input
					type="text"
					name="title"
					value={newHabit.title}
					onChange={(e) => {
						handleInputChange(e);
						if (e.target.value.trim()) {
							setTitleError(false);
						}
					}}
					placeholder="Title"
					style={{ borderColor: titleError ? 'red' : 'initial' }}
				/>
			</TableCell>
			<TableCell>
				<Input
					type="text"
					name="description"
					value={newHabit.description}
					onChange={handleInputChange}
					placeholder="Description"
				/>
			</TableCell>
			<TableCell>
				<Select value={newHabit.frequency} onValueChange={handleFreqChange}>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Frequency" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Daily">Daily</SelectItem>
						<SelectItem value="Weekly">Weekly</SelectItem>
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell></TableCell>
		</TableRow>
	);
};

export default HabitForm;
