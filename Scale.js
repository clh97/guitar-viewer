import React from 'react'
import { ScrollView, PanResponder, Dimensions } from 'react-native'

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

    return 440 * Math.pow(2, (keyNumber - 49) / 12);
}

const createFretFreq = () => {
    const guitarNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
    const fret = {};

    guitarNotes.forEach(gn => {
        fret[gn] = []

        const currentNoteIndex = notes.indexOf(gn);
        let tmpIndex = currentNoteIndex;
        let frequencyFactor = 4;
        Array.from({ length: 14 }, (cur, index) => {
            let currentNote = undefined
            console.log(index, '\ttmpIndex:', tmpIndex, '\tfreqFactor:', frequencyFactor, '\t', notes[tmpIndex])

            if (tmpIndex == notes.length - 1) {
                currentNote = notes[0];
                tmpIndex = 0;
                fret[gn].push({ note: currentNote, freq: getFrequency(`${currentNote}${frequencyFactor}`) });
                frequencyFactor++;
                return
            }

            currentNote = notes[tmpIndex];
            fret[gn].push({ note: currentNote, freq: getFrequency(`${currentNote}${frequencyFactor}`) })
            tmpIndex++
        })
        console.log(`---------${gn}----------\n\n`)
    })
}

function calcDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

const Scale = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const totalWidth = width * 5;
    const [indicatorPosition, setIndicatorPosition] = React.useState({ x: 0, y: 0 });
    let svgWidth = 100;
    let svgHeight = 100;

    const panResponder = PanResponder.create({
        onPanResponderMove:
            evt => {
                const touches = evt.nativeEvent.touches;
                const length = touches.length;
                if (length === 2) {
                    const [touch1, touch2] = touches;
                    const all = {
                        t1x: touch1.locationX,
                        t1y: touch1.locationY,
                        t2x: touch2.locationX,
                        t2y: touch2.locationY
                    };

                    const distance = calcDistance(all.t1x, all.t1y, all.t2x, all.t2y);

                    svgWidth = distance;
                    svgHeight = distance;

                    setIndicatorPosition(indicatorPosition)
                }
            },
        onPanResponderGrant: () => { },
        onPanResponderTerminate: () => { },
        onMoveShouldSetPanResponder: () => true,
        onStartShouldSetPanResponder: () => true,
        onShouldBlockNativeResponder: () => true,
        onPanResponderTerminationRequest: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponderCapture: () => true,
    })

    React.useEffect(() => {
        createFretFreq();
    }, [])

    const updateIndicatorPosition = e => {
        const { locationX: touchX, locationY: touchY } = e.nativeEvent;

        const xIndex = parseInt(touchX / (totalWidth / 14));
        const yIndex = parseInt(touchY / (height / 7));


        if (yIndex == lastYIndex) {
            fixedNotes[`${xIndex}-${yIndex}`] = { indicatorPosition, indexes: { xIndex, yIndex } }
        }

        lastYIndex = yIndex;

        setIndicatorPosition({
            x: parseInt(xIndex * (totalWidth / 14)) + (totalWidth / 14) / 2,
            y: parseInt(height / 7 + (yIndex * (height / 7))),
        })
    }

    return (
        <ScrollView
            {...panResponder.panHandlers}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{
                width: totalWidth,
                height: height,
            }}
        >
            <Svg
                onTouchEndCapture={updateIndicatorPosition}
                height='100%'
                width='100%'
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
                                    fill="#f1f1f1"
                                />
                                <Text
                                    fill="none"
                                    stroke="red"
                                    fontSize="20"
                                    fontWeight="bold"
                                    x="30"
                                    y={(index * (height / 7)).toString()}
                                    textAnchor="middle"
                                >
                                    {parseInt(index * (height / 7))}
                                </Text>
                            </React.Fragment>
                        )
                    })
                }
                {
                    Array.from({ length: 15 }, (cur, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Text
                                    fill="none"
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
                    r="20"
                    stroke="black"
                    strokeWidth="2.5"
                />
                {
                    Object.keys(fixedNotes).map(key => (
                        <Circle
                            key={key}
                            onPressOut={() => {
                                delete fixedNotes[key];
                            }}
                            cx={fixedNotes[key].indicatorPosition.x}
                            cy={fixedNotes[key].indicatorPosition.y}
                            r="20"
                            stroke="black"
                            fill="red"
                            strokeWidth="2.5"
                        />
                    ))
                }
            </Svg>
        </ScrollView>
    )
}

export default Scale
