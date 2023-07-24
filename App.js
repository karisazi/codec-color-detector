import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import {
    Welcome,
    ColorDetection,
    Listwarna,
    Support
} from "./src/screens";

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Welcome'}
            >
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Listwarna" component={Listwarna} />
                <Stack.Screen name="Support" component={Support} />
                <Stack.Screen name="ColorDetection" component={ColorDetection} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;