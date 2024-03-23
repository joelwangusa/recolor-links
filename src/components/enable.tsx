import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface EnableBtnProps {
  isEnabled: boolean;
  handleEnable: (enabled: boolean) => void;
}

function EnableBtn({isEnabled, handleEnable}: EnableBtnProps) {
  const onSwitchChange = (checked: boolean) => {
    handleEnable(checked)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="enable-btn"
      onCheckedChange={onSwitchChange}
      checked={isEnabled}/>
      <Label htmlFor="airplane-mode">{isEnabled? "ON": "OFF"}</Label>
    </div>
  )
}

export default EnableBtn;