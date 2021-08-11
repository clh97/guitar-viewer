import React from 'react'
import { ScrollView, PanResponder, Dimensions, Text as RNText } from 'react-native'

import Svg, {
    Circle,
    Ellipse,
    G,
    Text,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const guitarNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

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
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const forceUpdate = useForceUpdate();
    const totalWidth = width * 5;
    const [indicatorPosition, setIndicatorPosition] = React.useState({ x: 0, y: 0 });
    const [fretFreq, setFretFreq] = React.useState({});

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
            const posY = gnIndex * (height / 7);
            Array.from({ length: 14 }, (cur, index) => {
                let currentNote = undefined;
                const posX = (index + 1) * (width / 14);
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

                console.log(index, '\ttmpIndex:', tmpIndex, '\t', notes[tmpIndex], '\tfreqFactor:', frequencyFactor, '\tfreq:', frequency, '\tfreqNotation:', frequencyNotation(tmpIndex));

                tmpIndex++;
                currentNote = notes[tmpIndex];
                fret[gn].push({ note: currentNote, freq: frequency, position: { posX, posY } })
            })
            console.log(`---------${gn}----------\n\n`)
        })

        return fret;
    }

    const updateIndicatorPosition = e => {
        const { locationX: touchX, locationY: touchY } = e.nativeEvent;

        const xIndex = parseInt(touchX / (totalWidth / 14));
        const yIndex = parseInt(touchY / (height / 7));

        if (yIndex == lastYIndex) {
            fixedNotes[`${xIndex}-${yIndex}`] = { indicatorPosition, indexes: { xIndex, yIndex } }
            forceUpdate();
        }

        lastYIndex = yIndex;

        if (yIndex == 0 || yIndex <= 5) {
            setIndicatorPosition({
                x: parseInt(xIndex * (totalWidth / 14)) + (totalWidth / 14) / 2,
                y: parseInt(height / 7 + (yIndex * (height / 7))),
            });
        }
    }

    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{
                width: totalWidth,
                height: height,
            }}
            overScrollMode='never'
        >
            <Svg
                onTouchEndCapture={updateIndicatorPosition}
                height='100%'
                width='100%'
                style={{
                    position: 'relative',
                }}
            >
                {
                    Array.from({ length: 7 }, (cur, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Rect
                                    x="0"
                                    y={(index * (height / 7)).toString()}
                                    width="100%"
                                    height={height / 7}
                                    stroke="black"
                                    strokeWidth="1"
                                    fill="#624739"
                                />
                            </React.Fragment>
                        )
                    })
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
                                y={(height / 7) + index * (height / 7) + 8}
                                textAnchor="middle"
                            >
                                {note[0]}
                            </Text>
                        )
                    })
                }
                {
                    Array.from({ length: 15 }, (cur, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Text
                                    fill="white"
                                    stroke="black"
                                    fontSize="20"
                                    fontWeight="bold"
                                    x={(index * (totalWidth / 14) - ((totalWidth / 14) / 2)).toString()}
                                    y="40"
                                    textAnchor="middle"
                                >
                                    {index}
                                </Text>
                                <Rect
                                    x={(index * (totalWidth / 14)).toString()}
                                    y="0"
                                    width={totalWidth / 14}
                                    height="100%"
                                    stroke="black"
                                    strokeWidth="6"
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
            </Svg>
            {
                Object.keys(fretFreq).map((ffKey, ffIndex) => {
                    // if(ffKey[0] == 'B') {
                    //     console.log(fretFreq[ffKey])
                    // }
                    return Object.keys(fretFreq[ffKey]).map((nKey, nIndex) => {
                        return (
                            <RNText
                                key={`${ffIndex}-${nIndex}`}
                                style={{
                                    position: 'absolute',
                                    color: 'white',
                                    left: (nIndex + 1) * (totalWidth / 14) - 80,
                                    top: (height / 7) + fretFreq[ffKey][nKey].position.posY - 8,
                                }}
                            >
                                {fretFreq[ffKey][nKey].note} - {fretFreq[ffKey][nKey].freq}Hz
                            </RNText>
                        )
                    })
                })
            }
        </ScrollView>
    )
}

export default React.memo(Scale)
