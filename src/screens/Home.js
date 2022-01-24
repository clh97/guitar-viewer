import React from "react";
import { NativeModules, View, Text, Button } from "react-native";

import utils from "../config/utils";

import constants from "../config/const";

const Home = (props) => {
  const { navigation } = props;
  const { SoundModule } = NativeModules;

  React.useEffect(() => {
    (async () => {
      const collections = await utils.collections.retrieveSavedCollections();

      if (!collections) {
        await utils.collections.initCollection();
      }
    })();
  }, []);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: constants.height(),
      }}
    >
      <Button onPress={() => navigation.navigate("Scale")} title="Scale" />
      <Button
        onPress={() => {
          SoundModule.playSoundInFrequency(440);
        }}
        title="Sound"
      />
    </View>
  );
};

export default Home;
