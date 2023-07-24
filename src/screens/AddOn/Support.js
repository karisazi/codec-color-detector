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
                    justifyContent: 'center'
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

                <Text style={{ marginTop: SIZES.padding, ...FONTS.h1 }}>
                    Codec
                </Text>
                <Text style={{ marginTop: SIZES.base, ...FONTS.h4, marginHorizontal: 20 }}>
                    Codec adalah aplikasi yang digunakan untuk membantu penderita buta warna dalam mengetahui warna sebenarnya dari suatu objek yang memberikan keluaran warna berupa teks dan suara
                </Text>

                <Text style={{ marginTop: SIZES.padding-10, ...FONTS.h2 }}>
                    Fitur Realtime
                </Text>
                <Text style={{ marginTop: SIZES.base/5, ...FONTS.h6, marginHorizontal:18 }}>
                    Pengguna dapat memanfaatkan fitur realtime dengan mengarahkan area kotak hitam ke titik objek yang diinginkan dan kemudian menekan tombol deteksi
                </Text>

                <Text style={{ marginTop: SIZES.padding/2, ...FONTS.h2 }}>
                    Fitur Dokumen
                </Text>
                <Text style={{ marginTop: SIZES.base/5, ...FONTS.h6, marginHorizontal: 20 }}>
                    Pengguna dapat memanfaatkan fitur dokumen dengan menekan tombol dokumen untuk memilih gambar yang diinginkan dan melakukan crop pada area titik objek yang ingin diketahui warnanya
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