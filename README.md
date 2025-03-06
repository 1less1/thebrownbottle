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
4. System ENV Variables and PATH

### Windows ENV and PATH Configuration
**NOTE:** Your Java version may be different but that is okay!
<div align="center">
    <p>Update ENV Variables to <b>ANDROID_HOME and JAVA_HOME</b></p>
    <img src="./images/env_variables.png" alt="Update ENV Variables">
    <p>Add PATH: <b>C:\Users\<usernmame>\AppData\Local\Android\Sdk\platform-tools</b></p>
    <img src="./images/path_updated.png" alt="Update PATH">
</div>

## Start Fresh
1. Uninstall current **cli** programs.
    ```bash
    npm uninstall -g react-native-cli
    npm uninstall -g expo-cli
    react-native --version  # Should give an error if not installed globally
    expo --version           # Should give an error if not installed globally
    ```

2. Update **npm** to latest version globally.
    ```bash
    npm install -g npm@latest
    ```

3. Install the **expo cli** globally.
    ```bash
    npm install -g expo-cli
    npm fund
    ```

### Creating React Native Project with **Expo Go**
**NOTE:** Only do step 1 if you want to create a NEW project
1. Go to the directory where you want to create a new React Native Project
    ```bash
    npx create-expo-app <app-name> # Creates a new React Native Project in a folder within the current directory
    ```

2. If you already have a React Native project and are **cloning** from a Git Repo run the following command **IN** the directory that contains the **React Native Project files** aka "BrownBottleApp":
    ```bash
    npm install
    ```

3. Start the **Expo Go** application.
    - Navigate to the app-directory -> Ex: Brown Bottle App
    ```bash
    cd <app-directory>
    ```      

    - Run one the following **npm** command to start the app    
    ```bash
    npm start
    ```

<div align="center">
    <img src="./images/expo_start_screen.png" alt="Update ENV Variables">>
</div>


Other Helpful Commands
```bash
npx expo start # Uses the expo cli which brings up a menu where the user can pick what platform to host their application on!
```

### Android Studio AVD Setup (Optional)
**NOTE**: You only need to set up the AVD once and then Expo Go will handle the rest!
<div align="center">
    <p>Open the dropdown and select <b>Virtual Device Manager</b></p>
    <img src="./images/android_studio_home.png" alt="Android Studio Home">
    <p>Add a new AVD with the <b>+</b> or press the <b>triangle</b> to run an existing emulation</p>
    <img src="./images/avd_menu.png" alt="AVD Menu">
</div>

## Project Materials

Access preliminary UI design images [HERE](./ui_designs/)

### Project Colors
Light Tan - #F0E7E0
Dark Tan - #ECE1D4
Yellowish Tan - #FFDEAB
Brown - #7C580D
Greyish White (App Background) - #FBF7F7
Bright White - #FBF7F7

## MYSQL
IMPORTANT: Have the .env file in thebrownbottle root directory for docker compose to read.

Start in the root directory of the repository. 
HINT: You should be able to list the files and see docker-compose.yaml

Make sure docker service is running! (Open docker desktop or start the service from the command line)

Start MySQL container:

```bash
docker compose up # Runs in foreground

docker compose up -d # Runs in background
```

Connect to the MySQL container through the command line
```bash
mysql -h 127.0.0.1 -P 3306 -u root -p
```


## Project Resources
* To be continued...

