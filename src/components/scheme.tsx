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
  const [isEnabled, setIsEnabled] = useState(settings.isEnabled)
  const [selectedScheme, setSelectedScheme] = useState(settings.selectedScheme)
  const [CustomVisitedColor, setCustomVisitedColor] = useState(settings.colorSchemes[0].visited)
  const [CustomUnvisitedColor, setCustomUnvisitedColor] = useState(settings.colorSchemes[0].unvisited)
  const [colorSchemes, setColorSchemes] = useState(settings.colorSchemes)

  // handle color change for the input color picker
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const label = event.target.getAttribute('id')?.split('-')[1]
    if (label === "visited") {
      setCustomVisitedColor(event.target.value)
    } else {
      setCustomUnvisitedColor(event.target.value)
    }
  }

  // handle radio button change
  const handleRadioCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedScheme(event.target.value)
  }
  
  // Load settings from local storage
  useEffect(() => {
    const fetchSettings = async () => {
      // fetch data from local storage
      const local_settings = await loadSettings() as settingsType
      if (local_settings) {
        console.log("loaded settings from storage", local_settings)
        // Update state with the loaded settings
        setSettings(local_settings)
        setIsEnabled(local_settings.isEnabled)
        setSelectedScheme(local_settings.selectedScheme)
        setCustomVisitedColor(local_settings.VisitedColor)
        setCustomUnvisitedColor(local_settings.UnvisitedColor)
        setColorSchemes(local_settings.colorSchemes)
      }
    }
    fetchSettings()
  }, []);


  // Save settings to local storage when any variable changes
  useEffect(() => {
    settings.isEnabled = isEnabled
    settings.selectedScheme = selectedScheme
    settings.colorSchemes = colorSchemes
    settings.colorSchemes[0].visited = CustomVisitedColor
    settings.colorSchemes[0].unvisited = CustomUnvisitedColor
    
    if (selectedScheme === "custom") {
      settings.VisitedColor = CustomVisitedColor
      settings.UnvisitedColor = CustomUnvisitedColor
    } else {
      settings.VisitedColor = settings.colorSchemes.find((scheme) => scheme.key === selectedScheme)?.visited ?? settings.colorSchemes[0].visited
      settings.UnvisitedColor = settings.colorSchemes.find((scheme) => scheme.key === selectedScheme)?.unvisited ?? settings.colorSchemes[0].unvisited
    }
    // save settings to state
    setSettings(settings)
    // save settings to local storage
    saveSettings(settings)
  }, [isEnabled, selectedScheme, CustomVisitedColor, CustomUnvisitedColor, colorSchemes])

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
        {colorSchemes.map((colorScheme) => (
          <TableRow key={colorScheme.key} >
            <TableCell className="font-medium">
              <input id={"color-"+colorScheme.key}
              type="radio"
              onChange={handleRadioCheck}
              value={colorScheme.key}
              checked={selectedScheme === colorScheme.key}
              name="color-scheme"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={"color-"+colorScheme.key} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{colorScheme.desc}</label>           
            </TableCell>
            <TableCell>
              {colorScheme.key === "custom" ? (
                <input id={"preview-visited"}
                type="color"
                onChange={handleColorChange}
                value={CustomVisitedColor} />
              ) : (
                <div className="w-8 h-4 border border-gray-300 dark:border-gray-600" style={{backgroundColor: colorScheme.visited}} />
              )}
            </TableCell>
            <TableCell>
              {colorScheme.key === "custom" ? (
                <input id={"preview-unvisited"}
                type="color"
                onChange={handleColorChange}
                value={CustomUnvisitedColor} />
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
      <EnableBtn isEnabled={isEnabled} setIsEnabled={setIsEnabled}/>    </div>
    </>
  )
}

export default ColorSheme