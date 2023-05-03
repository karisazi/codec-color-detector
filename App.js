import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import {
    Welcome,
    Realtime,
    Listwarna,
    Support
} from "./screens";

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
                <Stack.Screen name="Realtime" component={Realtime} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;