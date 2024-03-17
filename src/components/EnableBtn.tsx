import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

function EnableBtn() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">OFF</Label>
    </div>
  );
}

export default EnableBtn;
