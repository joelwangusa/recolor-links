import { useState, useEffect, useRef } from "react"
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
import EnableBtn from "./EnableBtn";

const defaultSettings = {
  isEnabled: false,
  selectedScheme: "protanopia",
  VisitedColor: "#FF8C00",
  UnvisitedColor: "#708090",
  colorSchemes : [
    {
      key: "custom",
      desc: "Custom Scheme",
      visited: '#FF8C00', // Deep Orange
      unvisited: '#708090' // Slate Gray
    },
    {
      key: "protanopia",
      desc: "Red-green color deficiency",
      visited: '#0000FF', // Blue
      unvisited: '#FFFF00' // Yellow
    },
    {
      key: "tritanopia",
      desc: "Blue-yellow color deficiency",
      visited: '#FF00FF', // Magenta
      unvisited: '#00FF00' // Green
    },
    {
      key: "monochromacy",
      desc: "Complete color deficiency",
      visited: '#555555', // Gray
      unvisited: '#AAAAAA' // Light Gray
    },
  ]
}

export function ColorSheme() {
  // to prevent the initial render
  const firstUpdate = useRef(true);
  const [settings, setSettings] = useState(defaultSettings);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(settings.isEnabled)
  const [selectedScheme, setSelectedScheme] = useState(settings.selectedScheme)
  const [CustomVisitedColor, setCustomVisitedColor] = useState(settings.colorSchemes[0].visited)
  const [CustomUnvisitedColor, setCustomUnvisitedColor] = useState(settings.colorSchemes[0].unvisited)
  const colorSchemes = settings.colorSchemes

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
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    // fetch data from local storage
    setSettings(settings)
    console.log('Loading settings from local storage');
    setIsDataLoaded(true);
  }, []);
  
  // Save settings to local storage when any variable changes
  useEffect(() => {
    if (!isDataLoaded) return;
    
    settings.isEnabled = isEnabled
    settings.selectedScheme = selectedScheme
    settings.colorSchemes[0].visited = CustomVisitedColor
    settings.colorSchemes[0].unvisited = CustomUnvisitedColor
    
    if (selectedScheme === "custom") {
      settings.VisitedColor = CustomVisitedColor
      settings.UnvisitedColor = CustomUnvisitedColor
    } else {
      settings.VisitedColor = colorSchemes.find((scheme) => scheme.key === selectedScheme)?.visited ?? settings.colorSchemes[0].visited
      settings.UnvisitedColor = colorSchemes.find((scheme) => scheme.key === selectedScheme)?.unvisited ?? settings.colorSchemes[0].unvisited
    }

    // save settings to local storage
    console.log(settings)
  }, [isEnabled, selectedScheme, CustomVisitedColor, CustomUnvisitedColor])

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