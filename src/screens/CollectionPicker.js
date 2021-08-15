import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';

import constants from '../config/const';
import utils from '../config/utils';

const CollectionPickerButton = (props) => (
    <TouchableHighlight {...props}>
        <Text
            style={{
                color: 'white',
            }}
        >
            {props.title}
        </Text>
    </TouchableHighlight>
)

const CollectionPicker = (props) => {
    const { navigation } = props;

    const [collections, setCollections] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            const savedCollections = await utils.collections.retrieveSavedCollections();
            setCollections(savedCollections);
        })();
    }, []);

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text
                style={{
                    fontSize: 24,
                }}
            >
                Pick a collection:
            </Text>
            {
                collections && collections.length > 0 && collections.map((collection, index) => {
                    return (
                        <CollectionPickerButton
                            key={index}
                            title={collection.title}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 64,
                                height: 64,
                                backgroundColor: 'rgba(0, 0, 0, .5)',
                                margin: 10,
                            }}
                            onPress={() => props.onPick(collection.id)}
                        />
                    )
                })
            }
        </View>
    )
}

export default CollectionPicker
