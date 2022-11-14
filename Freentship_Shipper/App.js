import { MainNavigator } from './src/navigators/MainNavigator';
import { SignupScreen } from './src/screens/SignupScreen';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';

export default function App() {
    return (
        <PaperProvider>
            < MainNavigator />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => App);



