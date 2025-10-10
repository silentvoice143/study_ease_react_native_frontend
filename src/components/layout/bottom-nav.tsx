import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/home';
import StreamScreen from '../../screens/stream';
import SearchScreen from '../../screens/search';
import { COLORS } from '../../theme/colors';
import { scale, verticalScale } from '../../utils/sizer';
import CustomTabButton from './tab-button';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoteViewScreen from '../../screens/noteview';
import SubjectScreen from '../../screens/subjects';
import SemesterScreen from '../../screens/semester';
import NotesPYQScreen from '../../screens/note-pyq';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import OfflineFile from '../../screens/offline';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<any>();

function StreamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Stream" component={StreamScreen} />
      <Stack.Screen name="Semester" component={SemesterScreen} />
      <Stack.Screen name="Subject" component={SubjectScreen} />
      <Stack.Screen name="Noteview" component={NoteViewScreen} />
      <Stack.Screen name="Notes & PYQ" component={NotesPYQScreen} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  const navItems = [
    {
      label: 'Home',
      activeIcon: require('../../assets/imgs/tab/activehome.png'),
      inActiveIcon: require('../../assets/imgs/tab/inactivehome.png'),
      component: Home,
    },
    {
      label: 'StreamsTab',
      activeIcon: require('../../assets/imgs/tab/activestream.png'),
      inActiveIcon: require('../../assets/imgs/tab/inactivestream.png'),
      component: StreamStack,
    },
    {
      label: 'Offline',
      activeIcon: require('../../assets/imgs/tab/activedownload.png'),
      inActiveIcon: require('../../assets/imgs/tab/inactivedownload.png'),
      component: OfflineFile,
    },
    // {
    //   label: 'Search',
    //   activeIcon: require('../../assets/imgs/tab/activesearch.png'),
    //   inActiveIcon: require('../../assets/imgs/tab/inactivesearch.png'),
    //   component: SearchScreen,
    // },
  ];

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    // <Tab.Navigator
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarShowLabel: false,
    //     tabBarActiveTintColor: COLORS.voilet.dark,

    //     // ✅ Centered 90% width tab bar
    // tabBarStyle: {
    //   display: keyboardVisible ? 'none' : 'flex',
    //   position: 'absolute',
    //   bottom: verticalScale(20),
    //   marginHorizontal: '15%',
    //   height: verticalScale(64),
    //   borderRadius: scale(32),
    //   backgroundColor: COLORS.voilet.light,

    //   // Optional shadow
    //   elevation: 6,
    //   shadowColor: COLORS.voilet.lighter,
    //   shadowOpacity: 0.15,
    //   shadowRadius: 6,
    // },

    //   // ✅ Center each tab item
    //   tabBarItemStyle: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   },
    // }}
    // >
    //   {navItems.map((item, index) => (
    //     <Tab.Screen
    //       key={index}
    //       name={item.label}
    //       component={item.component}
    //       listeners={({ navigation }) => ({
    //         tabPress: e => {
    //           // Reset the stack to initial route on tab press
    //           navigation.reset({
    //             index: 0,
    //             routes: [{ name: item.label }],
    //           });
    //         },
    //       })}
    //       options={{
    //         tabBarButton: props => (
    //           <CustomTabButton
    //             {...props}
    //             activeIcon={item.activeIcon}
    //             inActiveIcon={item.inActiveIcon}
    //           />
    //         ),
    //       }}
    //     />
    //   ))}
    // </Tab.Navigator>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.voilet.dark,
      }}
    >
      {navItems.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.label}
          component={item.component}
          options={({ route }) => {
            // 👇 Check which screen is active inside this tab
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

            // Default style
            let tabBarStyle = {
              display: keyboardVisible ? 'none' : 'flex',
              position: 'absolute',
              bottom: verticalScale(20),
              marginHorizontal: '20%',
              height: verticalScale(64),
              borderRadius: scale(32),
              backgroundColor: COLORS.voilet.light,

              // Optional shadow
              elevation: 6,
              shadowColor: COLORS.voilet.lighter,
              shadowOpacity: 0.15,
              shadowRadius: 6,
            };

            // ✅ Hide tab bar when in Noteview
            if (routeName === 'Noteview') {
              tabBarStyle = { display: 'none' };
            }

            return {
              tabBarStyle,
              tabBarItemStyle: {
                justifyContent: 'center',
                alignItems: 'center',
              },
              tabBarButton: props => (
                <CustomTabButton
                  {...props}
                  activeIcon={item.activeIcon}
                  inActiveIcon={item.inActiveIcon}
                />
              ),
            };
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default BottomTabs;
