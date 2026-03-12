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
    'Ali İhsan Batmaz': require('../../pehlivanlar fotoğraf/ali-ihsan-batmaz.webp'),
    'Mehmet Yeşil Yeşil': require('../../pehlivanlar fotoğraf/mehmet-yesil-yesil.webp'),
    'İsmail Koç': require('../../pehlivanlar fotoğraf/ismail-koc.webp'),
    'Fatih Atlı': require('../../pehlivanlar fotoğraf/fatih-atli.jpg'),
    'Osman Kan': require('../../pehlivanlar fotoğraf/osman-kan.jpg'),
    'Hamza Köseoğlu': require('../../pehlivanlar fotoğraf/hamza-koseoglu.jpg'),
    'Recep Kara': require('../../pehlivanlar fotoğraf/recep-kara.jpg'),
    'Ertuğrul Dağdeviren': require('../../pehlivanlar fotoğraf/ertuğrul-dagdeviren.jpg'),
    'Nedim Gürel': require('../../pehlivanlar fotoğraf/nedim-gurel.png'),
    'Tanju Gemici': require('../../pehlivanlar fotoğraf/tanju-gemici.png'),
    'Kürşat Şevki Korkmaz': require('../../pehlivanlar fotoğraf/kursat-sevki-korkmaz.jpg'),
    'Mustafa Batu': require('../../pehlivanlar fotoğraf/mustafa-batu.jpg'),
    'Yunus Emre Yaman': require('../../pehlivanlar fotoğraf/yunus-emre-yaman.png'),
    'Bekir Eryücel': require('../../pehlivanlar fotoğraf/bekir-eryucel.jpg'),
    'Özkan Yılmaz': require('../../pehlivanlar fotoğraf/ozkan-yilmaz.webp'),
    'Seçkin Duman': require('../../pehlivanlar fotoğraf/seckin-duman.webp'),
    'Cengizhan Şimşek': require('../../pehlivanlar fotoğraf/cengizhan-simsek.webp'),
    'Yalçın Üncül': require('../../pehlivanlar fotoğraf/yalcin-uncul.jpg'),
    'Süleyman Aykırı': require('../../pehlivanlar fotoğraf/suleyman-aykiri.jpg'),
    'Rıza Yıldırım': require('../../pehlivanlar fotoğraf/riza-yildirim.jpg'),
};

export const getWrestlerPhoto = (name: string): ImageSourcePropType | null => {
    return WRESTLER_PHOTOS[name] || null;
};
