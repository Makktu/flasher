import { useKeepAwake } from 'expo-keep-awake';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function DisplayFlashMessage({
  userTime,
  returnTap,
  message,
  repeat,
  userBg,
  userTxt,
  randomBgColors,
  randomTxtColors,
  notifyRandom,
  lastNumber,
}) {
  useKeepAwake();
  //disable statusbar in message display
  const wordDuration = userTime;
  const [nextWord, setNextWord] = useState(0);
  const [isRandom, setIsRandom] = useState(userBg == 'random');
  const insets = useSafeAreaInsets();

  console.log('last number from parent: ', lastNumber);

  if (isRandom) {
    let theRandomPick = Math.floor(Math.random() * randomBgColors.length);
    console.log(theRandomPick, lastNumber);
    if (theRandomPick == lastNumber) {
      console.log('duplicate detected');
      theRandomPick += 1;
      if (theRandomPick > randomBgColors.length) {
        // always reset to 0 in case the adjusted number
        // is greater than teh length of the array
        theRandomPick = 0;
      }
      // and always report to parent component
    }
    userBg = randomBgColors[theRandomPick];
    userTxt = randomTxtColors[theRandomPick];
    notifyRandom(theRandomPick);
  }

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const FlashView = ({ children }) => {
    useKeepAwake();
    const animatedValue = useRef(new Animated.Value(0)).current; // initial value for word opacity

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: wordDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        animationEnded();
      });
    }, [animatedValue]);

    const animationEnded = () => {
      if (nextWord < message.length - 1) {
        setNextWord(nextWord + 1);
      } else {
        if (repeat) {
          setNextWord(0);
        }
      }
    };

    return (
      <SafeAreaView>
        <Animated.View
          style={{
            opacity: animatedValue,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Animated.View>
      </SafeAreaView>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={userBg} />
      <SafeAreaProvider style={[styles.container, { backgroundColor: userBg }]}>
        <TouchableOpacity onPress={returnTap}>
          <View>
            <FlashView>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[styles.text, { color: userTxt, padding: 2 }]}
              >
                {message[nextWord]}
              </Text>
            </FlashView>
          </View>
        </TouchableOpacity>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 1000,
  },
});
