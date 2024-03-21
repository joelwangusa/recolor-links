import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { settingsType } from "@/lib/chrome";

function EnableBtn({settings, setSettings}: {settings: settingsType, setSettings: (value: settingsType) => void}) {
  const onSwitchChange = (checked: boolean) => {
    const newSettings = { ...settings }
    newSettings.isEnabled = checked
    setSettings(newSettings)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="enable-btn"
      onCheckedChange={onSwitchChange}
      checked={settings.isEnabled}/>
      <Label htmlFor="airplane-mode">{settings.isEnabled? "ON": "OFF"}</Label>
    </div>
  );
}

export default EnableBtn;