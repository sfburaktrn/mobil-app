import { ImageSourcePropType } from 'react-native';

// Static require() map — React Native requires these to be literal strings
const WRESTLER_PHOTOS: Record<string, ImageSourcePropType> = {
    'Yusuf Can Zeybek': require('../../assets/wrestlers/yusuf-can-zeybek.png'),
    'Ali Gürbüz': require('../../assets/wrestlers/ali-gurbuz.png'),
    'İsmail Balaban': require('../../assets/wrestlers/ismail-balaban.png'),
    'Orhan Okulu': require('../../assets/wrestlers/orhan-okulu.png'),
    'Enes Doğan': require('../../assets/wrestlers/enes-doğan.jpg'),
    'Mustafa Taş': require('../../assets/wrestlers/mustafa-tas.png'),
    'Feyzullah Aktürk': require('../../assets/wrestlers/feyzullah-akturk.png'),
    'Hüseyin Gümüşalan': require('../../assets/wrestlers/huseyin-gumusalan.jpg'),
    'Serdar Yıldırım': require('../../assets/wrestlers/serdar-yıldırım.jpg'),
    'Erkan Taş': require('../../assets/wrestlers/erkan-tas.jpg'),
};

export const getWrestlerPhoto = (name: string): ImageSourcePropType | null => {
    return WRESTLER_PHOTOS[name] || null;
};
