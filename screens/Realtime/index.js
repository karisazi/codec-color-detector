import React from 'react';
import * as REA from 'react-native-reanimated';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Linking
} from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import {
    Camera,
    useCameraDevices,
    useFrameProcessor,
  } from 'react-native-vision-camera';
import {Svg, Defs, Rect, Mask} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker';
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

    // Camera
    const devices = useCameraDevices();
    const device = devices.back;

    const [color, setColor] = React.useState("")
    const [docImage, setDocImage] = React.useState("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Purple_website.svg/1200px-Purple_website.svg.png")
    const URL ="https://codecapp.pythonanywhere.com/predict-imagefile" 


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

          if (result == null) {
            return;
          }
        //   const col = JSON.stringify(result)
          REA.runOnJS(setColor)(result)
          REA.runOnJS(setColor)(result)
        //   color.value = col
          REA.runOnJS(setDetectButtonClicked)(false)
          console.log(`Return Values: ${JSON.stringify(result)} button: `, detectButtonClicked);

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
                    {selectedOption == constants.detect_color_option.realtime ? "Realtime" : "Dokumen"}
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
                    label="Dokumen"
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
                    onPress={choosePhotoFromLibrary}
                    // onPress={() => {
                    //     setSelectedOption(constants.detect_color_option.document)
                    // }}
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

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          freeStyleCropEnabled: true
        }).then(image => {
          console.log(image);
          setSelectedOption(constants.detect_color_option.document)
          setDocImage(image)
        });
      }

    uploadImage = async (image_uri) => {
        const formdata=new FormData()
        formdata.append('imagefile', {
          uri: image_uri.path,
          type: image_uri.mime,
          name: "uploadimagetmp.jpeg"
        })
        let res = await fetch(
          URL,
          {
              method: 'post',
              body: formdata,
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
          }
        );
        let responseJson = await res.json();
        console.log(responseJson, "responseJson")
        checkColor(responseJson.color)
        // setColor(responseJson.color)

    }

    checkColor=(param)=>{
 
        switch(param) {
     
          case 'black':
            setColor("Hitam");
            break;
          
          case 'white':
            setColor("Putih");
            break;
     
          case 'red':
            setColor("Merah");
            break;
     
          case 'blue':
            setColor("Biru");
            break;

          case 'yellow':
            setColor("Kuning");
            break;

          case 'green':
            setColor("Hijau");
            break;
          
          case 'violet':
            setColor("Ungu");
            break;
     
          case 'brown':
            setColor("Coklat");
            break;
     
          case 'grey':
            setColor("abu-abu");
            break;

          case 'orange':
            setColor("Orange");
            break;
     
          default:
            setColor("tunggu sebentar..");
        
          }
     
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
                        frameProcessorFps={100}
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
                            <View>
                                <TouchableOpacity 
                                    style={{
                                            flex: 0,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            padding: 7,
                                            paddingHorizontal: 20,
                                            alignSelf: 'center',
                                            margin: 20
                                    }}
                                    activeOpacity={.7}
                                    >
                                    <Text 
                                    style={{fontSize: 30, color:"red"}}>{color}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        {/* </View> */}
                        {/* </SafeAreaView> */}
                        
                    </MotiView>


                    {/* Realtime section  */}
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
                                    loaderAnimationState.transitionTo("start")

                                    setTimeout(() => {
                                        loaderAnimationState.transitionTo("stop")
                                    }, 2000)
                                }}
                            />

                        </View>
                        
                    }


                    {/* Document Section */}
                    {selectedOption == constants.detect_color_option.document &&
       
                        <View
                            style={{
                                position: 'absolute',
                                alignItems: 'center',
                                bottom: SIZES.padding,
                                left: 0,
                                right: 0
                            }}
                        >
                            <Image
                                source={{uri: docImage.path}}
                                style={{
                                    marginTop: 70,
                                    height: 250,
                                    width: 250,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: 'black',
                                    marginBottom: 30
                                }}
                            />

                            <TextButton
                                label="Deteksi Warna"
                                contentContainerStyle={{
                                    flex: 1,
                                    height: 50,
                                    paddingHorizontal: 15,
                                    marginLeft: SIZES.radius,
                                    borderRadius: SIZES.radius/2,
                                    backgroundColor: COLORS.dark
                                }}
                                labelStyle={{
                                    ...FONTS.h3,
                                    color: selectedOption == constants.detect_color_option.document ? COLORS.secondary : COLORS.primary
                                }}
                                onPress={() => {
                                    uploadImage(docImage)
                                    loaderAnimationState.transitionTo("start")

                                    setTimeout(() => {
                                        loaderAnimationState.transitionTo("stop")
                                    }, 2000)
                                }
                            }
                            
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