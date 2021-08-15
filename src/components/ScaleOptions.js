import React from 'react';
import { View, Text, Button, TouchableHighlight, Modal, ScrollView } from 'react-native';
import constants from '../config/const';
import utils from '../config/utils';
import CollectionList from '../screens/CollectionList';
import CollectionPicker from '../screens/CollectionPicker';
import Context from '../state/context';

const saveNotes = (notes) => {
  console.log('saving notes..')
  console.log({ notes })
  console.log('done! (or not o_o):w')
  console.log('how to pass notes as args to the scale component???????????????')
}

const ScaleOptionsButton = (props) => {
  return (
    <TouchableHighlight {...props}>
      <Text style={{
        fontSize: 16,
        color: 'black',
      }}>{props.title}</Text>
    </TouchableHighlight>
  )
}

const ScaleOptions = (props) => {
  const { fixedNotes } = props;
  const [collectionListModalVisible, setCollectionListModalVisible] = React.useState(false);
  const [collectionPickerModalVisible, setCollectionPickerModalVisible] = React.useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = React.useState(1);

  const notesWithFrequencies = Object.keys(fixedNotes).map(key => {
    return {
      note: fixedNotes[key].content.note,
      freq: fixedNotes[key].content.freq,
      indexes: fixedNotes[key].indexes,
    }
  });


  return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: constants.height() / 5,
        opacity: 0.75,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'black',
      }}>
        <ScaleOptionsButton
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 12,
            marginHorizontal: 10,
            backgroundColor: '#f1f1f1'
          }}
          title="save chord"
          onPress={() => setCollectionPickerModalVisible(!collectionPickerModalVisible)}
        />
        <ScaleOptionsButton
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 12,
            marginHorizontal: 10,
            backgroundColor: '#f1f1f1'
          }}
          title="collections"
          onPress={() => setCollectionListModalVisible(!collectionListModalVisible)}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={collectionListModalVisible}
          onRequestClose={e => console.log(e)}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 12,
            }}
          >
            <CollectionList />
            <Button title="close" onPress={() => setCollectionListModalVisible(false)} />
          </ScrollView>
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={collectionPickerModalVisible}
          onRequestClose={e => console.log(e)}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 12,
            }}
          >
            
            <CollectionPicker onPick={async (pickedId) => {
                setSelectedCollectionId(pickedId);
                setCollectionPickerModalVisible(false);
                const collections = await utils.collections.retrieveSavedCollections();
                const toUpdate = collections.find(collection => collection.id == pickedId);

                if(!toUpdate) {
                  console.log('no such collection id')
                  return
                }

                const newCollections = await utils.collections.insertToCollection(pickedId, notesWithFrequencies);

              }
            } />
            <Button title="close" onPress={() => setCollectionPickerModalVisible(false)} />
          </ScrollView>
        </Modal>
      </View>
  )
}

export default ScaleOptions
