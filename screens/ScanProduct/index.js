import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import {Svg, Defs, Rect, Mask} from "react-native-svg";

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

const ScanProduct = ({ navigation }) => {

    // State
    const [selectedOption, setSelectedOption] = React.useState(constants.scan_product_option.camera)

    // Camera
    const devices = useCameraDevices();
    const device = devices.back;

    React.useEffect(() => {
        requestCameraPermission()
    }, [])

    //Handler

    const requestCameraPermission = React.useCallback(async () => {
        const permission = await Camera.requestCameraPermission();

        if (permission === 'denied') await Linking.openSettings()
    }, [])

    // Render

    function renderHeader() {
        return (

            <View
                style={{
                    flexDirection: 'row',
                    paddingTop: SIZES.padding * 2,
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
                    {selectedOption == constants.scan_product_option.camera ? "Scan Camera" : "Scan QR Code"}
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
                    height: 90,
                    paddingTop: SIZES.radius,
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.light
                }}
            >
                <TextButton
                    label="Scan QR Code"
                    contentContainerStyle={{
                        flex: 1,
                        height: 55,
                        borderRadius: SIZES.radius,
                        backgroundColor: selectedOption == constants.scan_product_option.qr ? COLORS.primary : COLORS.lightGrey
                    }}
                    labelStyle={{
                        ...FONTS.h3,
                        color: selectedOption == constants.scan_product_option.qr ? COLORS.secondary : COLORS.primary
                    }}
                    onPress={() => {
                        setSelectedOption(constants.scan_product_option.qr)
                    }}
                />

                <TextButton
                    label="Scan Camera"
                    contentContainerStyle={{
                        flex: 1,
                        height: 55,
                        marginLeft: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: selectedOption == constants.scan_product_option.camera ? COLORS.primary : COLORS.lightGrey
                    }}
                    labelStyle={{
                        ...FONTS.h3,
                        color: selectedOption == constants.scan_product_option.camera ? COLORS.secondary : COLORS.primary
                    }}
                    onPress={() => {
                        setSelectedOption(constants.scan_product_option.camera)
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
                            x="44%"
                            y="46%"
                            width="50"
                            height="50"
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
                    x="44%"
                    y="46%"
                    width="50"
                    height="50"
                    strokeWidth="4"
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
                    />

                    {/* QR Code  */}
                    {selectedOption == constants.scan_product_option.qr  &&
                        <View 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            }}
                        >
                            <CameraFrame/>
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


export default ScanProduct;