import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Habit } from '@/data.store';

interface HabitRowProps {
	habit: Habit;
	toggleSuspended: (id: number) => void;
	deleteHabit: (id: number) => void;
	markHabitDone: (id: number) => void;
	isHabitDue: (habit: Habit) => boolean;
}

const HabitRow: React.FC<HabitRowProps> = ({
	habit,
	toggleSuspended,
	deleteHabit,
	markHabitDone,
	isHabitDue,
}) => {
	const completionPercentage = habit.progress;

	return (
		<TableRow
			key={habit.id}
			style={{ textDecoration: habit.suspended ? 'line-through' : 'none' }}
		>
			<TableCell className="flex justify-center">
				<Button onClick={() => toggleSuspended(habit.id)} className="mr-2">
					Suspend
				</Button>
				<Button onClick={() => deleteHabit(habit.id)} className="bg-red-200 mr-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="red"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</Button>
				<Button
					onClick={() => markHabitDone(habit.id)}
					disabled={!isHabitDue(habit)}
					className="mr-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={3}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m4.5 12.75 6 6 9-13.5"
						/>
					</svg>
				</Button>
			</TableCell>
			<TableCell className="title-cell">{habit.title}</TableCell>
			<TableCell className="description-cell">{habit.description}</TableCell>
			<TableCell>{habit.frequency}</TableCell>
			<TableCell>{Math.round(completionPercentage)}%</TableCell>
		</TableRow>
	);
};

export default HabitRow;
