import React from 'react';
import { View, Text, Button } from 'react-native';
import constants from '../config/const';

const saveNotes = (notes) => {
    console.log('saving notes..')
    console.log({ notes })
    console.log('done! (or not o_o):w')
    console.log('how to pass notes as args to the scale component???????????????')
}

const ScaleOptions = (props) => {

    const { fixedNotes } = props;

    const notesWithFrequencies = Object.keys(fixedNotes).map(key => {
        return {
            note: fixedNotes[key].content.note,
            freq: fixedNotes[key].content.freq,
        }
    });

    console.log(notesWithFrequencies)
    return (
        <View style={{
            alignItems: 'flex-start',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: constants.width(),
            height: constants.height() / 5,
            opacity: 0.75,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: 'black',
        }}>
            <Button
                title="save chord"
                onPress={() => saveNotes(notesWithFrequencies)}
            />
        </View>
    )
}

export default ScaleOptions
