import { Frequency, Habit } from "@/App";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HabitForm from "./HabitForm";
import HabitRow from "./HabitRow";

interface HabitTableProps {
  habits: Habit[];
  newHabit: Habit;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFreqChange: (value: Frequency) => void;
  addHabit: () => void;
  toggleSuspended: (id: number) => void;
  deleteHabit: (id: number) => void;
  markHabitDone: (id: number) => void;
  isHabitDue: (habit: Habit) => boolean;
}

const HabitTable: React.FC<HabitTableProps> = ({
  habits,
  newHabit,
  handleInputChange,
  handleFreqChange,
  addHabit,
  toggleSuspended,
  deleteHabit,
  markHabitDone,
  isHabitDue,
}) => {
  return (
    <Table className='habits-table'>
      <TableHeader>
        <TableRow>
          <TableHead>Actions</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Completion %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <HabitForm
          newHabit={newHabit}
          handleInputChange={handleInputChange}
          handleFreqChange={handleFreqChange}
          addHabit={addHabit}
        />
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            toggleSuspended={toggleSuspended}
            deleteHabit={deleteHabit}
            markHabitDone={markHabitDone}
            isHabitDue={isHabitDue}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default HabitTable;