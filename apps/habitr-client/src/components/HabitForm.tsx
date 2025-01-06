import { Frequency, Habit } from "@/App";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";

interface HabitFormProps {
  newHabit: Habit;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFreqChange: (value: Frequency) => void;
  addHabit: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ newHabit, handleInputChange, handleFreqChange, addHabit }) => {
  return (
    <TableRow>
      <TableCell>
        <Button onClick={addHabit}>Add Habit</Button>
      </TableCell>
      <TableCell>
        <Input
          type="text"
          name="title"
          value={newHabit.title}
          onChange={handleInputChange}
          placeholder="Title"
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
            <SelectItem value='Daily'>Daily</SelectItem>
            <SelectItem value='Weekly'>Weekly</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export default HabitForm;