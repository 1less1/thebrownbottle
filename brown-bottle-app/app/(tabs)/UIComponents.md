# What I did

**If you work on any other pages, please use the Card and DefaultView**  
So Far, I've only used Card in the hom/index, and DefaultView in home/index and chat/index. I will pdate more pages as i get time, or you can. Also with the UI, I will make more changes to closely follow the preliminary design.

## Card component

Made a Card.tsx to replace the "box" that was being used previously. It allows any valid react content inside the card, it also allows custom styles so it is very flexible and can be used for basically anything.

## DefaultView

Made this component to put some of the view styles we want to be default on every screen.
``` JavaScript
Includes: style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgApp,
        height: '100%',
        width: '100%',
      }}>
```

Includes SafeAreaView: ensres apps content is only displayed in the "safe area" avoids areas typically covered on smartphones.



## Removed

Thinking about removing the light/dark mode feature completley. Kinda would just make our code more complex, not even that important.


## Dom Edits
3/6 Edits:
- Added shadow effect to the Card.tsx file and recolored the navbar to be simplified (no light or dark mode).
- Added more colors to the constants/Colors.ts file.
- Added ClockWidget in components and inserted it into ClockIn.tsx. This has a live clock that updates and has the react states for clocking in and out!

3/8 Edits:
- Grouped components exclusively used on the home screen in a folder: /components/home/component_file.tsx
  - You can reference these components in an import statement with: '@components/home/component_file.tsx'
- In Card.tsx I made **alignItems: undefined** in the Style Sheet so it can be overridden easier for differrent use cases. This means you will have to designate the alignment manually every time you want to use a card component to: 'flext-start', 'center', 'flex-end'.

3/9 Edits:
- Made an **AltCard.tsx** component that is the exact same to the **Card.tsx** componenet except it has **"NO Elevation or Background Shadow Effect"**. 
- Also added working check box cards to the Tasks page!