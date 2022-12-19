import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import { MainNavigator } from './src/navigators/MainNavigator';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';


export default function App() {
    return (
        <PaperProvider>
            <Provider store={store}>  < MainNavigator /></Provider>
        </PaperProvider>
    );
}
AppRegistry.registerComponent(appName, () => App);
