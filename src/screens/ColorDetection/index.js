import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Animated, {
    runOnJS,
    useSharedValue,
  } from 'react-native-reanimated';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    AppState,
    StyleSheet,
    Button,
    Modal,
} from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import {
    Camera,
    useCameraDevices,
    useFrameProcessor,
  } from 'react-native-vision-camera';
import {Svg, Defs, Rect, Mask} from "react-native-svg";
import ImagePicker from 'react-native-image-crop-picker';
import { detectColor } from '../../utils/detectColor';
import Sound from 'react-native-sound';

import {
    IconButton,
    TextButton
} from "../../components";
import {
    COLORS,
    SIZES,
    FONTS,
    icons,
    constants
} from "../../constants";


const ReanimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({
  isActive: true,
});

const ModalPopup = ({visible, children}) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      toggleModal();
    }, [visible]);
    const toggleModal = () => {
      if (visible) {
        setShowModal(true);
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(() => setShowModal(false), 200);
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };
    return (
      <Modal transparent visible={showModal}>
        <View style={styles.modalBackGround}>
          <Animated.View
            style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  };

const MAX_FRAME_PROCESSOR_FPS = 3;

const ColorDetection = ({ navigation }) => {

    // State
    const [selectedOption, setSelectedOption] = React.useState(constants.detect_color_option.realtime)

    const [modalVisible, setModalVisible] = React.useState(false);

    // Camera
    const colorAnimationDuration = useMemo(
        () => (1 / frameProcessorFps) * 1000,
        [frameProcessorFps],
      );
    
    const [frameProcessorFps, setFrameProcessorFps] = useState(3);
    const isPageActive = useSharedValue(true);
    const isHolding = useSharedValue(false);

    const devices = useCameraDevices('wide-angle-camera');
    const device = devices.back;

    const [colorRealtime, setColorRealtime] = React.useState("")
    const [colorDoc, setColorDoc] = React.useState("")
    const [docImage, setDocImage] = React.useState("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Purple_website.svg/1200px-Purple_website.svg.png")
    const URL ="https://codecapp.pythonanywhere.com/predict-imagefile" 

    let color_sound;
    

    const onCameraError = useCallback((CameraRuntimeError) => {
        console.error(`${CameraRuntimeError.code}: ${CameraRuntimeError.message}`, CameraRuntimeError.cause);
      }, []);
    const onCameraInitialized = useCallback(() => {
        console.log('Camera initialized!');
      }, []);

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

    React.useEffect(() => {
        console.log(colorRealtime)

        playSound(colorRealtime)

        setTimeout(() => {
            stopSound()
        }, 2500)

    }, [colorRealtime])

    React.useEffect(() => {
        console.log(colorDoc)

        playSound(colorDoc)

        setTimeout(() => {
            stopSound()
        }, 2500)
    }, [colorDoc])

    //Handler

    const requestCameraPermission = React.useCallback(async () => {
        const permission = await Camera.requestCameraPermission();

        if (permission === 'denied') await Linking.openSettings()
    }, [])


    const frameProcessor = useFrameProcessor(
        frame => {
          'worklet';
          
          const result = detectColor(frame);

          if (result == null) {
            return;
          }
          runOnJS(setColorRealtime)(result)

        },
        [isHolding],
      );
    
    
 

    const onFrameProcessorPerformanceSuggestionAvailable = useCallback(
        ( FrameProcessorPerformanceSuggestion) => {
        const newFps = Math.min(
            FrameProcessorPerformanceSuggestion,
            MAX_FRAME_PROCESSOR_FPS,
        );
        setFrameProcessorFps(newFps);
        },
        [],
    );

    useEffect(() => {
        const listener = AppState.addEventListener('change', state => {
        isPageActive.value = state === 'active';
        });
        return () => {
        listener.remove();
        };
    }, [isPageActive, isHolding]);
   

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
                    {selectedOption == constants.detect_color_option.realtime &&
                    <ReanimatedCamera
                        style={{ flex: 1}}
                        device={device}
                        isActive={true} 
                        frameProcessor={frameProcessor}
                        onError={onCameraError}
                        onInitialized={onCameraInitialized}
                        enableZoomGesture
                        frameProcessorFps={frameProcessorFps}
                    />
                    }

                        {/* Display color  */}
                        <MotiView
                            style={{
                                position: 'absolute',
                                alignItems: 'center',
                                top: SIZES.padding,
                                left: 0,
                                right: 0
                            }}
                            animationDuration={colorAnimationDuration}
                        >
                            <ModalPopup visible={modalVisible}>
                                <View style={{alignItems: 'center'}}>
                                <View style={styles.header}>
                                    <TouchableOpacity onPress={() => setVisible(false)}>
                                    <Image
                                        // source={require('./assets/x.png')}
                                        style={{height: 30, width: 30}}
                                    />
                                    </TouchableOpacity>
                                </View>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                <Image
                                    // source={require('../../../assets/ico')}
                                    style={{height: 150, width: 150, marginVertical: 10}}
                                />
                                </View>

                                <Text style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}}>
                                Congratulations registration was successful
                                </Text>
                            </ModalPopup>

                            {/* Realtime Color  */}
                            {selectedOption == constants.detect_color_option.realtime &&
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
                                        animationDuration={colorAnimationDuration}
                                        onPress={() => setModalVisible(true)}
                                        >
                                        <Text 
                                        style={{fontSize: 30, color:"red"}}>{colorRealtime}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                         }
                        
                        {/* Document Color  */}
                        {selectedOption == constants.detect_color_option.document &&

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
                                            animationDuration={colorAnimationDuration}
                                            >
                                            <Text 
                                            style={{fontSize: 30, color:"red"}}>{colorDoc}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            
                        </MotiView>

                    {/* Realtime section  */}
                    {selectedOption == constants.detect_color_option.realtime &&
       
                        <View
                            style={{
                                position: 'absolute',
                                alignItems: 'center',
                                top:200,
                                bottom: SIZES.padding*9,
                                left: 0,
                                right: 0
                            }}
                        >
                        
                            {/* kotak objek */}
                            <CameraFrame/> 

                            <TouchableOpacity
                                containerStyle={{
                                    top: 140,
                                    height: 57,
                                    width: 57,
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center'
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

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >


                                 <View
                                style={{
                                    marginHorizontal: 20,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >


                                <IconButton
                                    icon={icons.book_open}
                                    containerStyle={{
                                        marginLeft: 0
                                    }}
                                    iconStyle={{
                                        width: 50,
                                        height: 50
                                    }}
                                    onPress={choosePhotoFromLibrary}
                                />
                                <Text>Pilih Gambar</Text>
                                </View>

                                <View
                                style={{
                                    marginHorizontal: 20,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >

                                <IconButton
                                    icon={icons.search_fill}
                                    containerStyle={{
                                        marginLeft: SIZES.base
                                    }}
                                    iconStyle={{
                                        width: 50,
                                        height: 50
                                    }}
                                    onPress={() => {
                                        uploadImage(docImage)}}
                                />
                                <Text>Deteksi Warna</Text>
                                </View>


                            </View>
                        </View> 
                    }
                </View>
            )
        }
    }

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
                    icon={icons.color}
                    iconStyle={{
                        width: 25,
                        height: 25
                    }}
                    onPress={() => navigation.navigate("Listwarna")}
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
                    onPress={() => navigation.navigate("Support")}
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
                    stroke="#fff"
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
        setColorDoc(responseJson.color)

    }

    const playSound = (Warna) => {
        switch(Warna) {
          case 'Hitam':
            color_sound = new Sound (require('../../../assets/audio/hitam.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
          
          case 'Putih':
            color_sound = new Sound (require('../../../assets/audio/putih.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
     
          case 'Merah':
            color_sound = new Sound (require('../../../assets/audio/merah.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
     
          case 'Orange':
            color_sound = new Sound (require('../../../assets/audio/orange.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;

          case 'Kuning':
            color_sound = new Sound (require('../../../assets/audio/kuning.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;

          case 'Hijau':
            color_sound = new Sound (require('../../../assets/audio/hijau.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
          
          case 'Biru':
            color_sound = new Sound (require('../../../assets/audio/biru.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
     
          case 'Ungu':
            color_sound = new Sound (require('../../../assets/audio/ungu.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
     
          case 'Coklat':
            color_sound = new Sound (require('../../../assets/audio/coklat.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;

          case 'Abu-abu':
            color_sound = new Sound (require('../../../assets/audio/abu.mp3') , (error, _sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }
                color_sound.play(() => {
                    color_sound.release();
                });
            });
            break;
     
          default:
            setColorRealtime("Warna");
            setColorDoc("Warna");


        }
    }

    const stopSound = () => {
        if (color_sound) {
            color_sound.stop(() => {
                console.log('Stop audio');
        });
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


const styles = StyleSheet.create({
    modalBackGround: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 30,
      borderRadius: 20,
      elevation: 20,
    },
    header: {
      width: '100%',
      height: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });


export default ColorDetection;