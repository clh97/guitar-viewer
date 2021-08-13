import React from 'react';
import { View, Text, Button } from 'react-native';

import constants from '../config/const';

const Home = (props) => {
    const { navigation } = props;
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: constants.height()
        }}>
            <Button onPress={() => navigation.navigate('Scale')} title="Scale" />
        </View>
    )
}

export default Home
