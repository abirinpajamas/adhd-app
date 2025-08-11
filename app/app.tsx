// App.tsx or App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import HomeScreen from "./(tabs)/index"; // Your original file
import AssessmentResultScreen from "./(tabs)/results";
import SignUp from "./signup"; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManualCalculation"
          component={AssessmentResultScreen}
          options={{ title: "Assessment Results" }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUp}
          options={{ title: "Sign Up" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
