# What I did

# If you work on any other pages, please use the Card and DefaultView 
So Far, I've only used Card in the hom/index, and DefaultView in home/index and chat/index. I will pdate more pages as i get time, or you can. Also with the UI, I will make more changes to closely follow the preliminary design.

## Card component

Made a Card.tsx to replace the "box" that was being used previously. It allows any valid react content inside the card, it also allows custom styles so it is very flexible and can be used for basically anything.

## DefaultView

Made this component to put some of the view styles we want to be default on every screen.

Includes: style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.greyWhite,
        height: '100%',
        width: '100%',
      }}>

Includes SafeAreaView: ensres apps content is only displayed in the "safe area" avoids areas typically covered on smartphones.



## Removed

Thinking about removing the light/dark mode feature completley. Kinda would just make our code more complex, not even that important.
