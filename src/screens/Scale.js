import React from 'react'
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { ScrollView, Text as RNText } from 'react-native'
import Svg, {
    Circle,
    Text,
    Line,
} from 'react-native-svg';

import constants from '../config/const';
import ScaleOptions from '../components/ScaleOptions';

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const guitarNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

const fretQuantity = 14;
const noteQuantity = guitarNotes.length;

let lastYIndex = undefined;
let fixedNotes = {};

const getFrequency = (note) => {
    let octave, keyNumber;
    if (note.length === 3) {
        octave = note.charAt(2);
    } else {
        octave = note.charAt(1);
    }

    keyNumber = notes.indexOf(note.slice(0, -1));

    if (keyNumber < 3) {
        keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
    } else {
        keyNumber = keyNumber + ((octave - 1) * 12) + 1;
    }

    return (440 * Math.pow(2, (keyNumber - 49) / 12)).toFixed(2);
}

function useForceUpdate() {
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

const Scale = () => {
    const forceUpdate = useForceUpdate();
    const width = constants.width();
    const height = constants.height();
    const totalWidth = width * 3;
    const [indicatorPosition, setIndicatorPosition] = React.useState({ x: 0, y: 0 });
    const [fretFreq, setFretFreq] = React.useState({});
    const [optionsShown, setOptionsShown] = React.useState(true);

    React.useEffect(() => {
        setFretFreq(createFretFreq());
    }, [])

    const createFretFreq = () => {
        const fret = {};

        guitarNotes.forEach((gn, gnIndex) => {
            fret[gn] = [];

            const currentNoteIndex = notes.indexOf(gn[0]);
            let tmpIndex = currentNoteIndex;
            let frequencyFactor = parseInt(gn[1]);
            const posY = gnIndex * (height / (noteQuantity + 1));
            Array.from({ length: fretQuantity }, (cur, index) => {
                let currentNote = undefined;
                const posX = (index + 1) * (width / fretQuantity);
                const frequencyNotation = index => (notes[index] + frequencyFactor).toString();
                let frequency = getFrequency(
                    frequencyNotation(tmpIndex)
                );

                if (tmpIndex == notes.length - 1) {
                    currentNote = notes[0];
                    frequency = getFrequency(
                        frequencyNotation(tmpIndex).toString()
                    );
                    tmpIndex = 0;
                    fret[gn].push({ note: currentNote, freq: frequency, position: { posX, posY } });
                    return
                } else if (tmpIndex == 2) {
                    frequencyFactor = frequencyFactor + 1;
                }

                // console.log(index, '\ttmpIndex:', tmpIndex, '\t', notes[tmpIndex], '\tfreqFactor:', frequencyFactor, '\tfreq:', frequency, '\tfreqNotation:', frequencyNotation(tmpIndex));

                tmpIndex++;
                currentNote = notes[tmpIndex];
                fret[gn].push({ note: currentNote, freq: frequency, position: { posX, posY } })
            })
            // console.log(`---------${gn}----------\n\n`)
        })

        return fret;
    }

    const updateIndicatorPosition = e => {
        const { locationX: touchX, locationY: touchY } = e.nativeEvent;

        const xIndex = parseInt(touchX / (totalWidth / fretQuantity));
        const yIndex = parseInt(touchY / (height / (noteQuantity + 1)));

        const currentString = Object.keys(fretFreq)[yIndex];
        const content = fretFreq[currentString][xIndex];

        if (yIndex == lastYIndex) {
            fixedNotes[`${xIndex}-${yIndex}`] = {
                indicatorPosition,
                indexes: { xIndex, yIndex },
                content,
            };
            forceUpdate();
        }

        lastYIndex = yIndex;

        if (yIndex == 0 || yIndex <= 5) {
            setIndicatorPosition({
                x: parseInt(xIndex * (totalWidth / fretQuantity)) + (totalWidth / fretQuantity) / 2,
                y: parseInt(height / (noteQuantity + 1) + (yIndex * (height / (noteQuantity + 1)))),
            });
        }
    }

    return (
        <PinchGestureHandler
            onEnded={(e) => {
                if (e.nativeEvent.velocity <= 0) {
                    setOptionsShown(!optionsShown);
                }
            }}
        >
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    width: totalWidth,
                    height: height,
                    position: 'relative',
                }}
                overScrollMode='never'
            >
                <Svg
                    onTouchEndCapture={e => updateIndicatorPosition(e, fretFreq)}
                    height='100%'
                    width='100%'
                    style={{
                        position: 'relative',
                        backgroundColor: "#624739"
                    }}
                >
                    {
                        Array.from({ length: fretQuantity + 1 }, (cur, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Text
                                        fill="white"
                                        stroke="black"
                                        fontSize="20"
                                        fontWeight="bold"
                                        x={(index * (totalWidth / fretQuantity) - ((totalWidth / fretQuantity) / 2)).toString()}
                                        y="40"
                                        textAnchor="middle"
                                    >
                                        {index}
                                    </Text>
                                    {
                                        index != 0 && <Line
                                            x1={(index * (totalWidth / fretQuantity)).toString()}
                                            x2={(index * (totalWidth / fretQuantity)).toString()}
                                            y1="0"
                                            y2={height}
                                            width={totalWidth / fretQuantity}
                                            stroke="#805b49"
                                            strokeWidth="6"
                                        />
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                    {
                        Array.from({ length: noteQuantity + 1 }, (cur, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Line
                                        x1="0"
                                        x2={totalWidth}
                                        y1={index * (height / (noteQuantity + 1))}
                                        y2={index * (height / (noteQuantity + 1))}
                                        stroke="gray"
                                        strokeWidth="3"
                                    />
                                </React.Fragment>
                            )
                        })
                    }
                    <Circle
                        cx={indicatorPosition.x}
                        cy={indicatorPosition.y}
                        r="15"
                        stroke="black"
                        strokeWidth="2.5"
                    />
                    {
                        Object.keys(fixedNotes).map(key => (
                            <Circle
                                key={key}
                                onPressOut={() => {
                                    delete fixedNotes[key];
                                    forceUpdate()
                                }}
                                cx={fixedNotes[key].indicatorPosition.x}
                                cy={fixedNotes[key].indicatorPosition.y}
                                r="10"
                                stroke="black"
                                fill="white"
                                strokeWidth="2.5"
                            />
                        ))
                    }
                    {
                        guitarNotes.map((note, index) => {
                            return (
                                <Text
                                    key={`${note}-${index}`}
                                    fill="white"
                                    stroke="black"
                                    fontSize="20"
                                    fontWeight="bold"
                                    x="20"
                                    y={(height / (noteQuantity + 1)) + index * (height / (noteQuantity + 1)) + 8}
                                    textAnchor="middle"
                                >
                                    {note[0]}
                                </Text>
                            )
                        })
                    }
                </Svg>
                {
                    Object.keys(fretFreq).map((ffKey, ffIndex) => {
                        return Object.keys(fretFreq[ffKey]).map((nKey, nIndex) => {
                            return (
                                <RNText
                                    key={`${ffIndex}-${nIndex}`}
                                    style={{
                                        position: 'absolute',
                                        color: 'white',
                                        left: (nIndex + 1) * (totalWidth / fretQuantity) - 80,
                                        top: (height / (noteQuantity + 1)) + fretFreq[ffKey][nKey].position.posY - 8,
                                    }}
                                >
                                    {fretFreq[ffKey][nKey].note} - {fretFreq[ffKey][nKey].freq}Hz
                                </RNText>
                            )
                        })
                    })
                }
                {
                    optionsShown && <ScaleOptions fixedNotes={fixedNotes} />
                }
            </ScrollView>
        </PinchGestureHandler>
    )
}

export default React.memo(Scale)