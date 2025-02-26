# What I did
## Icons
I added SF Icons for IOS devices and Material Icons for Android/Windows. I mapped the icons in IconSymbol.tsx, then added them to their designated tab in _layout.tsx.

## Tab Folders
At first the tabs were files, but I was able to make them into folders and get them to redirect to each other. -- name="tasks/index"-- 

## Theme
Added theme support for the tabs I made

## Startup Screen
I made an index.tsx file with a "LandingScreen" in the app folder -> app/index.tsx
I then told the app/_layout.tsx file to have the new index.tsx file -> "index" load first on the app "stack"
Redirects to home/index, the home page