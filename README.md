# thebrownbottle
<div align="center">
    <img src="./images/brown_bottle_logo.jpg" alt="Update ENV Variables">>
</div>

### CS4800 Research 
#### Student Researchers: Dominick Olhava, Ishimwe Gentil, Aaryn Warrior
#### Faculty Advisor: Dr. Andrew Berns


## Installing React Native 

### Initial Dependencies
Follow steps [HERE](https://reactnative.dev/docs/set-up-your-environment) for installing:
1. Node.js
2. JDK
3. Android Studio
4. Android System ENV Variables and PATH

### Windows ENV and PATH Configuration
<div align="center">
    <p>Update ENV Variables to <b>ANDROID_HOME</b></p>
    <img src="./images/env_variables.png" alt="Update ENV Variables">
    <p>Add PATH: <b>C:\Users\<usernmame>\AppData\Local\Android\Sdk\platform-tools</b></p>
    <img src="./images/path_updated.png" alt="Update PATH">
</div>

### Creating React Native Project with **Expo Go**
1. Go to the directory where you want to create a new React Native Project
    ```bash
    npx create-expo-app@latest <app-name> # Creates a new React Native Project in a folder within the current directory
    ```

2. If you already have a React Native project and are **cloning** from a Git Repo run the following command **IN** the directory that contains the React Native Project files:
    ```bash
    npm install
    ```

3. **Expo Go** Commands
    - Navigate to the app-directory -> Ex: brown-bottle-app
    ```bash
    cd <app-directory>
    ```      

    - Run one of the following npm commands to start the app    
    ```bash
    npm run android
    npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac.
    npm run web
    ```
Other Helpful Commands
```bash
npx expo start # Uses the expo cli which brings up a menu where the user can pick what platform to host their application on!
```

<div align="center">
    <img src="./images/expo_start_screen.png" alt="Update ENV Variables">>
</div>

### Android Studio AVD Setup
**NOTE**: You only need to set up the AVD once and then Expo Go commands will handle the rest!
<div align="center">
    <p>Open the dropdown and select <b>Virtual Device Manager</b></p>
    <img src="./images/android_studio_home.png" alt="Android Studio Home">
    <p>Add a new AVD with the <b>+</b> or press the <b>triangle</b> to run an existing emulation</p>
    <img src="./images/avd_menu.png" alt="AVD Menu">
</div>