import React from 'react';
import { View, Text, Button } from 'react-native';
import utils from '../config/utils';

import constants from '../config/const';

const Home = (props) => {
    const { navigation } = props;

    React.useEffect(() => {

        (async () => {
            const collections = await utils.collections.retrieveSavedCollections();

            if(!collections) {
                await utils.collections.initCollection();
            }
         })();
    }, []);

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
