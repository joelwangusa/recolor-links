import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EnableBtn from "./enable";
import { defaultSettings,
  settingsType,
  saveSettings,
  loadSettings } from "@/lib/chrome"


export function ColorSheme() {
  // to prevent the initial render
  const [settings, setSettings] = useState(defaultSettings);
  const [customVisited, setCustomVisited] = useState(settings.colorSchemes[0].visited)
  const [customUnvisited, setCustomUnvisited] = useState(settings.colorSchemes[0].unvisited)

  // handle color change for the input color picker
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const label = event.target.getAttribute('id')?.split('-')[1]
    const newSettings = { ...settings }
    if (label === "visited") {
      setCustomVisited(event.target.value)
      newSettings.colorSchemes[0].visited = event.target.value
    } else {
      setCustomUnvisited(event.target.value)
      newSettings.colorSchemes[0].unvisited = event.target.value
    }
    setSettings(newSettings)
  }

  // handle radio button change
  const handleRadioCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSettings = { ...settings }
    newSettings.selectedScheme = event.target.value
    newSettings.visitedColor = newSettings.colorSchemes.find((scheme) => scheme.key === event.target.value)?.visited || newSettings.visitedColor
    newSettings.unvisitedColor = newSettings.colorSchemes.find((scheme) => scheme.key === event.target.value)?.unvisited || newSettings.unvisitedColor
    setSettings(newSettings)
  }
  
  // Load settings from local storage
  useEffect(() => {
    const fetchSettings = async () => {
      // fetch data from local storage
      const local_settings = await loadSettings() as settingsType
      if (local_settings) {
        // Update state with the loaded settings
        setSettings(local_settings)
        setCustomVisited(local_settings.colorSchemes[0].visited)
        setCustomUnvisited(local_settings.colorSchemes[0].unvisited)
      }
    }
    fetchSettings()
  }, []);


  // Save settings to local storage when any variable changes
  useEffect(() => {
    // save settings to local storage
    saveSettings(settings)
  }, [settings])

  return (
    <>
    <Table>
      <TableCaption>Use the button below to turn ON/OFF the extension.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[256px]">Color Scheme</TableHead>
          <TableHead>Visited</TableHead>
          <TableHead>Unvisited</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.colorSchemes.map((colorScheme) => (
          <TableRow key={colorScheme.key} >
            <TableCell className="font-medium">
              <input id={"color-"+colorScheme.key}
              type="radio"
              onChange={handleRadioCheck}
              value={colorScheme.key}
              checked={settings.selectedScheme === colorScheme.key}
              name="color-scheme"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={"color-"+colorScheme.key} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{colorScheme.desc}</label>           
            </TableCell>
            <TableCell>
              {colorScheme.key === "custom" ? (
                <input id={"preview-visited"}
                type="color"
                onChange={handleColorChange}
                value={customVisited} />
              ) : (
                <div className="w-8 h-4 border border-gray-300 dark:border-gray-600" style={{backgroundColor: colorScheme.visited}} />
              )}
            </TableCell>
            <TableCell>
              {colorScheme.key === "custom" ? (
                <input id={"preview-unvisited"}
                type="color"
                onChange={handleColorChange}
                value={customUnvisited} />
              ) : (
                <div className="w-8 h-4 border border-gray-300 dark:border-gray-600" style={{backgroundColor: colorScheme.unvisited}} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
    <div className="my-4 w-20 mx-auto">
      <EnableBtn settings={settings} setSettings={setSettings}/>
    </div>
    </>
  )
}

export default ColorSheme