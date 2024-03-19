import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

function EnableBtn({isEnabled, setIsEnabled}: {isEnabled: boolean, setIsEnabled: (value: boolean) => void}) {
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsEnabled(newValue);
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="enable-btn"
      onCheckedChange={onSwitchChange}
      checked={isEnabled}/>
      <Label htmlFor="airplane-mode">{isEnabled? "OFF": "ON"}</Label>
    </div>
  );
}

export default EnableBtn;