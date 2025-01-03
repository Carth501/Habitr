import { Switch } from "@/components/ui/switch";

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className='flex justify-end'>
      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      Dark Mode
    </div>
  );
};

export default DarkModeToggle;