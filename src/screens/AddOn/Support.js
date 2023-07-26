import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import { TextButton } from "../../components";
import { COLORS, FONTS, SIZES, icons } from '../../constants';

const Support = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.light
            }}
        >
            {/* Logo & Title */}
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    source={icons.logo}
                    style={{
                        marginTop: 100,
                        width: 100,
                        height: 100
                    }}
                />

                <Text style={{ marginTop: SIZES.padding, ...FONTS.largeTitle }}>
                    Codec
                </Text>
                <Text style={{ marginTop: SIZES.base, ...FONTS.body4, textAlign: 'justify', marginHorizontal: 30}}>
                    Codec adalah aplikasi ramah penderita buta warna untuk mengetahui warna sebenarnya dari suatu objek dengan keluaran warna berupa teks dan suara
                </Text>

                <Text style={{ marginTop: SIZES.padding-10, ...FONTS.h2 }}>
                    Fitur Realtime
                </Text>
                <Text style={{ marginTop: SIZES.base/5, ...FONTS.body5, textAlign: 'justify' , marginHorizontal: 30 }}>
                    Pengguna dapat memanfaatkan fitur realtime dengan mengarahkan area kotak target ke titik objek yang ingin diketahui warnanya
                </Text>

                <Text style={{ marginTop: SIZES.padding/2, ...FONTS.h2 }}>
                    Fitur Dokumen
                </Text>
                <Text style={{ marginTop: SIZES.base/5, ...FONTS.body5, textAlign: 'justify', marginHorizontal: 30 }}>
                    Pengguna dapat memanfaatkan fitur dokumen dengan menekan tombol "Pilih Gambar" untuk memilih gambar yang diinginkan dan melakukan crop pada area titik objek yang ingin diketahui warnanya
                </Text>
            </View>

            {/* Footer Buttons */}
            <View
                style={{
                    paddingHorizontal: SIZES.padding,
                    marginBottom: 15,
                    alignItems: 'flex-end',
                    marginTop: 70
                }}
            >
                <TextButton
                    contentContainerStyle={{
                        height: 40,
                        width: 70,
                        borderRadius: SIZES.radius
                    }}
                    label="Kembali"
                    onPress={() => navigation.navigate("ColorDetection")}
                />

            </View>
        </View>
    )
}

export default Support;