import React from 'react';
import 'react-native-reanimated';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import {
    Camera,
    CameraProps,
    CameraRuntimeError,
    FrameProcessorPerformanceSuggestion,
    useCameraDevices,
    useFrameProcessor,
  } from 'react-native-vision-camera';
import {Svg, Defs, Rect, Mask} from "react-native-svg";

import { detectColor } from '../../frame-processors/detectColor';

import {
    IconButton,
    TextButton
} from "../../components";
import {
    COLORS,
    SIZES,
    FONTS,
    icons,
    constants,
    images
} from "../../constants";


const Realtime = ({ navigation }) => {

    // State
    const [selectedOption, setSelectedOption] = React.useState(constants.detect_color_option.realtime)

    const [detectButtonClicked, setDetectButtonClicked] = React.useState(false)

    const [color, setColor] = React.useState("")

    // Camera
    const devices = useCameraDevices();
    const device = devices.back;

    // Moti
    const loaderAnimationState = useAnimationState({
        start: {
            opacity: 1
        },
        stop: {
            opacity: 0
        }
    })

    React.useEffect(() => {
        // Animation
        loaderAnimationState.transitionTo("stop")

        // Permission
        requestCameraPermission()
    }, [])

    //Handler

    const requestCameraPermission = React.useCallback(async () => {
        const permission = await Camera.requestCameraPermission();

        if (permission === 'denied') await Linking.openSettings()
    }, [])


    const frameProcessor = useFrameProcessor(
        frame => {
          'worklet';
          if (detectButtonClicked == false) {
            // handbrake
            return;
          }
          const result = detectColor(frame);
          console.log(`Return Values: ${JSON.stringify(result)}`);

          if (result == null) {
            return;
          }
          setColor(result)

        },
        [detectButtonClicked],
      );
      
    // Render

    function renderHeader() {
        return (

            <View
                style={{
                    flexDirection: 'row',
                    paddingTop: SIZES.padding,
                    paddingBottom: SIZES.radius,
                    paddingHorizontal: SIZES.padding,
                    alignItems: 'center',
                    backgroundColor: COLORS.light,
                    zIndex: 1
                }}
            >

                {/* Close */}
                <IconButton
                    icon={icons.close}
                    onPress={() => navigation.goBack()}
                />

                {/* Title */}
                <Text
                    style={{
                        flex: 1,
                        marginLeft: SIZES.radius,
                        ...FONTS.h2
                    }}
                >
                    {selectedOption == constants.detect_color_option.realtime ? "Realtime" : "Daftar Warna"}
                </Text>

                {/* Add. options */}
                <IconButton
                    icon={icons.flash}
                    iconStyle={{
                        width: 25,
                        height: 25
                    }}
                />

                <IconButton
                    icon={icons.question_mark}
                    containerStyle={{
                        marginLeft: SIZES.base
                    }}
                    iconStyle={{
                        width: 25,
                        height: 25
                    }}
                />
            </View>
        )
    }

    function renderFooter() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 75,
                    paddingTop: SIZES.radius,
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.light
                }}
            >
                <TextButton
                    label="Realtime"
                    contentContainerStyle={{
                        flex: 1,
                        height: 50,
                        borderRadius: SIZES.radius,
                        backgroundColor: selectedOption == constants.detect_color_option.realtime ? COLORS.primary : COLORS.lightGrey
                    }}
                    labelStyle={{
                        ...FONTS.h3,
                        color: selectedOption == constants.detect_color_option.realtime ? COLORS.secondary : COLORS.primary
                    }}
                    onPress={() => {
                        setSelectedOption(constants.detect_color_option.realtime)
                    }}
                />

                <TextButton
                    label="Daftar Warna"
                    contentContainerStyle={{
                        flex: 1,
                        height: 50,
                        marginLeft: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: selectedOption == constants.detect_color_option.document ? COLORS.primary : COLORS.lightGrey
                    }}
                    labelStyle={{
                        ...FONTS.h3,
                        color: selectedOption == constants.detect_color_option.document ? COLORS.secondary : COLORS.primary
                    }}
                    onPress={() => {
                        setSelectedOption(constants.detect_color_option.document)
                    }}
                />
            </View>
        )
    }

    function CameraFrame() {
        return (
            <Svg
                height="100%"
                width="100%"
            >
                <Defs>
                    <Mask
                        id="mask"
                        x="0"
                        y="0"
                        height="100%"
                        width="100%"
                    >
                        <Rect height="100%" width="100%" fill="#000" />
                        <Rect
                            x="47%"
                            y="48%"
                            width="20"
                            height="20"
                            fill="white"
                        />
                    </Mask>
                </Defs>

                <Rect
                    height="100%"
                    width="100%"
                    fill="rgba(0, 0, 0, 0)"
                    mask="url(#mask)"
                />

                {/* Frame Border  */}
                <Rect
                    x="47%"
                    y="48%"
                    width="20"
                    height="20"
                    strokeWidth="3"
                    stroke="#000"
                    fillOpacity="0"
                />
            </Svg>
        )
    }

    function renderCamera() {
        if (device == null) {
            return (
                <View
                    style={{
                        flex: 1
                    }}
                />
            )
        } else {
            return (
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <Camera
                        style={{ flex: 1}}
                        device={device}
                        isActive={true}
                        enableZoomGesture
                        frameProcessor={frameProcessor}
                        frameProcessorFps={5}
                    />

                    {/* Display color  */}
                    <MotiView
                        state={loaderAnimationState}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            top: SIZES.padding,
                            left: 0,
                            right: 0
                        }}
                    >
                        <Text 
                            style={{
                                backgroundColor: 'blue', 
                                marginLeft:10, alignSelf: 'flex-start', 
                                color: "white", 
                                fontSize:20
                            }}
                        >
                                {/* {color} Ketan  */}
                                Biru
                        </Text>
                        
                    </MotiView>


                    {/* Detect Button  */}
                    {selectedOption == constants.detect_color_option.realtime &&
       
                        <View
                            style={{
                                position: 'absolute',
                                alignItems: 'center',
                                bottom: SIZES.padding*9,
                                left: 0,
                                right: 0
                            }}
                        >
                            <CameraFrame/>
                            <IconButton
                                icon={icons.detect}
                                containerStyle={{
                                    top: 140,
                                    height: 57,
                                    width: 57,
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.light
                                }}
                                iconStyle={{
                                    width: 65,
                                    height: 65,
                                    // tintColor: COLORS.primary
                                }}
                                onPress={() => {
                                    setDetectButtonClicked(true)
                                    setColor("cek")
                                    loaderAnimationState.transitionTo("start")

                                    setTimeout(() => {
                                        loaderAnimationState.transitionTo("stop")
                                    }, 3000)
                                }}
                            />

                        </View>
                        
                    }

                </View>
            )
        }
    }

    return (
        <View
            style={{
                flex: 1
            }}
        >
            {/* Header */}
            {renderHeader()}

            {/* Camera */}
            {renderCamera()}

            {/* Footer */}
            {renderFooter()}
        </View>
    )
}


export default Realtime;