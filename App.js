import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import {
    Welcome,
    Home,
    ScanProduct
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
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ScanProduct" component={ScanProduct} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;