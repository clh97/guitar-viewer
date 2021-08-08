import React from 'react'
import { ScrollView, Dimensions } from 'react-native'

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

const Scale = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const totalWidth = width * 5;
    const [indicatorPosition, setIndicatorPosition] = React.useState({ x: 0, y: 0 });

    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            onTouchStart={e => {
                const xIndex = parseInt(e.nativeEvent.locationX / (totalWidth / 14));
                const yIndex = parseInt(e.nativeEvent.locationY / (height / 7));

                setIndicatorPosition({
                    x: parseInt(xIndex * (totalWidth / 14)) + (totalWidth / 14) / 2,
                    y: parseInt(yIndex * (height / 7)),
                })
            }}
            contentContainerStyle={{
                width: totalWidth,
                height: height,
            }}
        >
            <Svg
                height="100%"
                width="100%"
            >
                {
                    Array.from({ length: 7 }, (cur, index) => {
                        return (
                            <>
                                <Rect
                                    key={index}
                                    x="0"
                                    y={(index * (height / 7)).toString()}
                                    width="100%"
                                    height={height / 7}
                                    stroke="black"
                                    strokeWidth="1"
                                    fill="#f1f1f1"
                                />
                            </>
                        )
                    })
                }
                {
                    Array.from({ length: 15 }, (cur, index) => {
                        return (
                            <>
                                <Text
                                    fill="none"
                                    stroke="purple"
                                    fontSize="20"
                                    fontWeight="bold"
                                    x={(index * (totalWidth / 14) - ((totalWidth / 14) / 2)).toString()}
                                    y="40"
                                    textAnchor="middle"
                                >
                                    {index}
                                </Text>
                                <Rect
                                    key={index}
                                    x={(index * (totalWidth / 14)).toString()}
                                    y="0"
                                    width={totalWidth / 14}
                                    height="100%"
                                    stroke="black"
                                    strokeWidth="6"
                                />
                            </>
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
            </Svg>
        </ScrollView>
    )
}

export default Scale
