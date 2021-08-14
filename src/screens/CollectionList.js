import React from 'react';
import { View, Text, Button, SectionList, AsyncStorage } from 'react-native';

import constants from '../config/const';
import utils from '../config/utils';

const Collection = (props) => (
    <View>
        <Text>{props.title}</Text>
        <Text>{JSON.stringify(props.collection)}</Text>
    </View>
)

const CollectionList = (props) => {
    const { navigation } = props;
    const [ collections, setCollections ] = React.useState([]);

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
            {/* <SectionList
                sections={collections}
                keyExtractor={(item, index) => item.title + index}
                renderItem={(item) => <Collection {...item} />}
                renderSectionHeader={({ title }) => (
                    <Text style={{
                        fontSize: 30,
                    }}>{title}</Text>
                )}
            /> */}
            {
                collections && collections.map(collection => {
                    return (
                        <Collection key={collection.id} {...collection} />
                    )
                })
            }
        </View>
    )
}

export default CollectionList;
