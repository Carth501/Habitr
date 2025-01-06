import { Habit } from "@/App";
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from "@/components/ui/table";

interface HabitRowProps {
  habit: Habit;
  toggleSuspended: (id: number) => void;
  deleteHabit: (id: number) => void;
  markHabitDone: (id: number) => void;
  isHabitDue: (habit: Habit) => boolean;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, toggleSuspended, deleteHabit, markHabitDone, isHabitDue }) => {
  const completionPercentage = habit.progress;

  return (
    <TableRow key={habit.id} style={{ textDecoration: habit.suspended ? 'line-through' : 'none' }}>
      <TableCell>
        <Button onClick={() => toggleSuspended(habit.id)}>Suspend</Button>
        <Button onClick={() => deleteHabit(habit.id)}>Delete</Button>
        <Button onClick={() => markHabitDone(habit.id)} disabled={!isHabitDue(habit)}>Mark as Done</Button>
      </TableCell>
      <TableCell className='title-cell'>{habit.title}</TableCell>
      <TableCell className='description-cell'>{habit.description}</TableCell>
      <TableCell>{habit.frequency}</TableCell>
      <TableCell>{completionPercentage}%</TableCell>
    </TableRow>
  );
};

export default HabitRow;