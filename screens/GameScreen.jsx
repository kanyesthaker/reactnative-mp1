import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity, ImageBackground } from "react-native";

import { styles } from "../constants/Styles";
import { nameToPic } from "../constants/Constants";
import { useEffect } from "react";
import { shuffle } from "../utils/ArrayUtils";
const names = Object.keys(nameToPic);

export default function GameScreen() {
  // TODO: Declare and initialize state variables here, using "useState".
  const [numCorrect, setNumCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [img, setImg] = useState(require("../assets/MemberPictures/aadypillai.jpg"));
  const [namesList, setNamesList] = useState([]);
  // State for the timer is handled for you.
  const [timeLeft, setTimeLeft] = useState(5000);

  // Called by the timer every 10 seconds
  const countDown = () => {
    if (timeLeft > 0) {
      // Time still left, so decrement time state variable
      setTimeLeft(timeLeft - 1000);
    } else {
      // Time has expired
      // TODO: update appropriate state variables
      setTotal(total + 1);
    }
  };

  // This is used in the useEffect(...) hook bound on a specific STATE variable.
  // It updates state to present a new member & name options.
  const getNextRound = () => {
    // Fetches the next member name to guess.
    let correct = names[Math.floor(Math.random() * names.length)];
    let correctName = nameToPic[correct][0];
    let correctImage = nameToPic[correct][1];

    // Generate 3 more wrong answers.
    let nameOptions = [correctName];
    while (nameOptions.length < 4) {
      let wrong = names[Math.floor(Math.random() * names.length)];
      let wrongName = nameToPic[wrong][0];
      if (!nameOptions.includes(wrongName)) {
        nameOptions.push(wrongName);
      }
    }
    nameOptions = shuffle(nameOptions);

    setCorrectIndex(nameOptions.indexOf(correctName));
    setNamesList(nameOptions);
    setImg(correctImage);

    setTimeLeft(5000);
  };

  // Called when user taps a name option.
  // TODO: Update correct # and total # state values.
  const selectedNameChoice = (index) => {
    if (index===correctIndex){
      setNumCorrect(numCorrect + 1);
      setTotal(total + 1);
    } else {
      setTotal(total + 1);
    }
  };

  // Call the countDown() method every 10 milliseconds.
  useEffect(() => {
    const timer = setInterval(() => countDown(), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  // TODO: Finish this useEffect() hook such that we automatically
  // get the next round when the appropriate state variable changes.
  useEffect(
    () => {
      getNextRound();
    },
    [
      total
    ]
  );

  // Set up four name button components
  const nameButtons = [];
  for (let i = 0; i < 4; i++) {
    const j = i;
    nameButtons.push(
      // A button is just a Text component wrapped in a TouchableOpacity component.
      <TouchableOpacity
        key={j}
        style={styles.button}
        onPress={() => selectedNameChoice(j)}
      >
        <Text style={styles.buttonText}>
          {namesList[j]}
        </Text>
      </TouchableOpacity>
    );
  }

  const timeRemainingStr = (timeLeft / 1000).toFixed(0);

  // Style & return the view.
  return (
    <View style={styles.container}>
      {/* TODO: Build out your UI using Text and Image components. */}
      {/* Hint: What does the nameButtons list above hold? 
          What types of objects is this list storing?
          Try to get a sense of what's going on in the for loop above. */}
      <Text style={styles.scoreText}>
        {numCorrect}/{total}
      </Text>
      <Text style={styles.timerText}>
        {timeRemainingStr}
      </Text>
      <Image
        source={img}
        style={styles.image}
      />
      <View>
        {nameButtons}
      </View>
      
    </View>
  );
}
