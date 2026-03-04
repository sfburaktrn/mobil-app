export interface MatchHistory {
    id: string;
    opponentName: string;
    result: 'WIN' | 'LOSS';
    date: string;
    round: string;
}

export interface Wrestler {
    id: number;
    name: string;
    title: string;
    city: string;
    about: string;
    age: number;
    height: number;
    weight: number;
    imageUrl: string;
    coverImageUrl?: string;
    championships: string;
    medals?: { gold: number, silver: number, bronze: number };
    totalMatches?: number;
    winRate?: number;
    recentMatches: MatchHistory[];
}

export interface TournamentMatch {
    id: string;
    round: string;
    wrestler1: Wrestler;
    wrestler2: Wrestler;
}

const RAW_DATA = [
    { "id": 1, "name": "Yusuf Can Zeybek", "hometown": "Antalya", "about": "2023-2024 Kırkpınar Başpehlivanı. Paça kazık oyununda usta, yüksek kondisyonlu.", "last_5_matches": ["W", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/yusuf-can.jpg" },
    { "id": 2, "name": "Ali Gürbüz", "hometown": "Antalya", "about": "Mega Star. Üç kez Altın Kemer sahibi. Teknik ve fizik gücü çok yüksek.", "last_5_matches": ["W", "L", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/ali-gurbuz.jpg" },
    { "id": 3, "name": "İsmail Balaban", "hometown": "Antalya", "about": "Sarı Fırtına. Çabukluğu ve pes etmeyen yapısıyla tanınan çift şampiyon.", "last_5_matches": ["L", "W", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/ismail-balaban.jpg" },
    { "id": 4, "name": "Orhan Okulu", "hometown": "Antalya", "about": "Geri vitesi olmayan pehlivan. Defansif güreşin ve sabrın ustası.", "last_5_matches": ["W", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/orhan-okulu.jpg" },
    { "id": 5, "name": "Enes Doğan", "hometown": "Antalya", "about": "2024-2025 sezonunun yükselen yıldızı. Ligin en çok puan toplayan ismi.", "last_5_matches": ["W", "W", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/enes-dogan.jpg" },
    { "id": 6, "name": "Mustafa Taş", "hometown": "Sinop", "about": "2022 Başpehlivanı. Genç, dinamik ve çok yönlü bir güreşçi.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/mustafa-tas.jpg" },
    { "id": 7, "name": "Feyzullah Aktürk", "hometown": "Manisa", "about": "Sert el enseleri ve minder tecrübesiyle rakiplerine korku salıyor.", "last_5_matches": ["W", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/feyzullah-akturk.jpg" },
    { "id": 8, "name": "Hüseyin Gümüşalan", "hometown": "Kocaeli", "about": "Karamürsel ekolünün dev temsilcisi. Saf güç ve heybet.", "last_5_matches": ["W", "W", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/huseyin-gumusalan.jpg" },
    { "id": 9, "name": "Serdar Yıldırım", "hometown": "Sakarya", "about": "Yeni nesil teknik güreşin en iyi örneklerinden. Atak ve cesur.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/serdar-yildirim.jpg" },
    { "id": 10, "name": "Erkan Taş", "hometown": "Sinop", "about": "Başaltından fırtına gibi çıktı. 2025 Kırkpınar'ın sürpriz ismi.", "last_5_matches": ["W", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/erkan-tas.jpg" },
    { "id": 11, "name": "Ali İhsan Batmaz", "hometown": "Antalya", "about": "Çok hızlı dalışları olan, rakiplerini şaşırtan bir yetenek.", "last_5_matches": ["L", "W", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/ali-ihsan.jpg" },
    { "id": 12, "name": "Mehmet Yeşil Yeşil", "hometown": "Antalya", "about": "Efsane tecrübe. Altın puanın en büyük ustası.", "last_5_matches": ["L", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/mehmet-yesil.jpg" },
    { "id": 13, "name": "İsmail Koç", "hometown": "Konya", "about": "Kule lakaplı, 2 metrelik dev. Fizik avantajını çok iyi kullanır.", "last_5_matches": ["W", "L", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/ismail-koc.jpg" },
    { "id": 14, "name": "Fatih Atlı", "hometown": "Samsun", "about": "Ladikli şampiyon. Oyun kurma yeteneği ve zekasıyla ön planda.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/fatih-atli.jpg" },
    { "id": 15, "name": "Osman Kan", "hometown": "Antalya", "about": "Lig etaplarının en istikrarlı pehlivanlarından biri.", "last_5_matches": ["W", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/osman-kan.jpg" },
    { "id": 16, "name": "Hamza Köseoğlu", "hometown": "Erzurum", "about": "Dadaşlar diyarının güçlü temsilcisi. Yıkılması zor bir kale.", "last_5_matches": ["L", "L", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/hamza-koseoglu.jpg" },
    { "id": 17, "name": "Recep Kara", "hometown": "Ordu", "about": "Ordulu efsane. 4 Altın kemerli yaşayan tarih.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/recep-kara.jpg" },
    { "id": 18, "name": "Ertuğrul Dağdeviren", "hometown": "Balıkesir", "about": "Balıkesir'in en büyük kozu. Mücadeleci ve hırslı.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/ertugrul.jpg" },
    { "id": 19, "name": "Nedim Gürel", "hometown": "Kocaeli", "about": "Karamürsel'in kemik pehlivanlarından. Sert güreşi sever.", "last_5_matches": ["W", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/nedim-gurel.jpg" },
    { "id": 20, "name": "Tanju Gemici", "hometown": "Samsun", "about": "Hücum güreşinin temsilcisi. Sürekli arayan, atak yapan stil.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/tanju-gemici.jpg" },
    { "id": 21, "name": "Kürşat Şevki Korkmaz", "hometown": "Antalya", "about": "Korkuteli'nin gururu. Kontra ataklarda çok tehlikeli.", "last_5_matches": ["W", "L", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/kursat.jpg" },
    { "id": 22, "name": "Mustafa Batu", "hometown": "Antalya", "about": "Zeki ve stratejik. Maçı son dakikaya kadar bırakmaz.", "last_5_matches": ["W", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/mustafa-batu.jpg" },
    { "id": 23, "name": "Yunus Emre Yaman", "hometown": "Zonguldak", "about": "Maden gibi sağlam. Başaltından gelip devleri zorlayan isim.", "last_5_matches": ["W", "W", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/yunus-emre.jpg" },
    { "id": 24, "name": "Bekir Eryücel", "hometown": "Çorum", "about": "Çorum'un en büyük umudu. Puanlamada çok dikkatli.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/bekir-eryucel.jpg" },
    { "id": 25, "name": "Özkan Yılmaz", "hometown": "Samsun", "about": "İstikrar abidesi. Karadeniz ekolünün sert temsilcisi.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/ozkan-yilmaz.jpg" },
    { "id": 26, "name": "Seçkin Duman", "hometown": "Kocaeli", "about": "Hızlı gelişen, genç ve iddialı bir başpehlivan.", "last_5_matches": ["W", "L", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/seckin-duman.jpg" },
    { "id": 27, "name": "Cengizhan Şimşek", "hometown": "Antalya", "about": "Tribünlerin sevgilisi. Hırslı ve gösterişli güreşir.", "last_5_matches": ["W", "W", "W", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/cengizhan.jpg" },
    { "id": 28, "name": "Yalçın Üncül", "hometown": "Bursa", "about": "Bursa'nın en güçlü ismi. Sabırlı ve teknik.", "last_5_matches": ["W", "W", "L", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/yalcin.jpg" },
    { "id": 29, "name": "Süleyman Aykırı", "hometown": "Sakarya", "about": "Yılların tecrübesi, zorlu kura çekimlerinin korkulu rüyası.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/suleyman.jpg" },
    { "id": 30, "name": "Menderes Yılmaz", "hometown": "Antalya", "about": "Hızlı ve çevik. Küçük boy avantajını hıza çevirir.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/menderes.jpg" },
    { "id": 31, "name": "Semih Turgut", "hometown": "Yalova", "about": "Yalova'nın tek başpehlivanı. Çok dirençli.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/semih-turgut.jpg" },
    { "id": 32, "name": "Hüseyin İyican", "hometown": "Manisa", "about": "Ege bölgesinin yükselen değeri. Teknik kapasitesi yüksek.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/iyican.jpg" },
    { "id": 33, "name": "Salih Dorum", "hometown": "Antalya", "about": "Çayırın en eski kurtlarından. Oyun bilgisi derya.", "last_5_matches": ["L", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/salih-dorum.jpg" },
    { "id": 34, "name": "Serhat Gökmen", "hometown": "Samsun", "about": "Atak güreşiyle bilinir, her an maçı bitirebilir.", "last_5_matches": ["W", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/serhat-gokmen.jpg" },
    { "id": 35, "name": "Rıza Yıldırım", "hometown": "Tokat", "about": "Minderden gelen çevikliği yağla birleştiriyor.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/riza-yildirim.jpg" },
    { "id": 36, "name": "Ali Altun", "hometown": "Antalya", "about": "Direnciyle rakiplerini yoran, puanlamada etkili isim.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/ali-altun.jpg" },
    { "id": 37, "name": "Furkan Durmuş Altın", "hometown": "Antalya", "about": "Yükselen bir form grafiğine sahip genç yetenek.", "last_5_matches": ["W", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/furkan.jpg" },
    { "id": 38, "name": "Faruk Akkoyun", "hometown": "Kocaeli", "about": "Sert ve yıpratıcı güreşiyle tanınan tecrübeli isim.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/faruk.jpg" },
    { "id": 39, "name": "Şaban Yılmaz", "hometown": "Samsun", "about": "Eski şampiyon. Gücüyle hâlâ gençlere taş çıkartıyor.", "last_5_matches": ["L", "L", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/saban.jpg" },
    { "id": 40, "name": "Onur Balcı", "hometown": "Tokat", "about": "Tokat'ın gururu. Mücadeleyi asla bırakmayan tarzı var.", "last_5_matches": ["L", "W", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/onur.jpg" },
    { "id": 41, "name": "İbrahim Çoraman", "hometown": "Antalya", "about": "Ligin gizli kahramanlarından, çok teknik.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/ibrahim.jpg" },
    { "id": 42, "name": "Osman Özgün", "hometown": "Kocaeli", "about": "Hücum ağırlıklı, genç başpehlivan.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/ozgun.jpg" },
    { "id": 43, "name": "Kaan Kaya", "hometown": "Kocaeli", "about": "Sürekli basan, rakiplerine nefes aldırmayan tarz.", "last_5_matches": ["W", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/kaan.jpg" },
    { "id": 44, "name": "Ali Yanatma", "hometown": "Muğla", "about": "Muğla'nın tek başpehlivanı. Çok dayanıklı.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/yanatma.jpg" },
    { "id": 45, "name": "Ramazan Bircan", "hometown": "Antalya", "about": "Paça oyunlarında uzman, seri bir güreşçi.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/bircan.jpg" },
    { "id": 46, "name": "Hasan Cengiz", "hometown": "Antalya", "about": "Tecrübeli, oyun kurmayı seven başpehlivan.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/hasan.jpg" },
    { "id": 47, "name": "Salih Erinç", "hometown": "Samsun", "about": "Fizik gücü yerinde, sert Karadenizli.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/erinc.jpg" },
    { "id": 48, "name": "Ahmet Kavakçı", "hometown": "Sakarya", "about": "Yılların eskitemediği kurt pehlivan.", "last_5_matches": ["L", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/kavakci.jpg" },
    { "id": 49, "name": "Ünal Karaman", "hometown": "Çorum", "about": "Çorumlu yiğit. Anadolu güreşinin temsilcisi.", "last_5_matches": ["W", "L", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/unal.jpg" },
    { "id": 50, "name": "Hadi Yılmaz", "hometown": "Antalya", "about": "Genç jenerasyonun dikkat çeken isimlerinden.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/hadi.jpg" },
    { "id": 51, "name": "Turan Balaban", "hometown": "Antalya", "about": "İsmail Balaban'ın ikizi. İkizi kadar hızlı ve çevik.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/turan.jpg" },
    { "id": 52, "name": "Emre Erkal", "hometown": "Antalya", "about": "Atak ve sürprize açık bir güreş tarzı var.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/erkal.jpg" },
    { "id": 53, "name": "Ali Güngör Ekin", "hometown": "Kocaeli", "about": "Kocaeli bölgesinin beyefendi ve teknik pehlivanı.", "last_5_matches": ["L", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/gungor.jpg" },
    { "id": 54, "name": "Atilla Güzel", "hometown": "Konya", "about": "Güreş ağır sıklet tecrübesini çayıra yansıtıyor.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/atilla.jpg" },
    { "id": 55, "name": "Ahmet Selbest", "hometown": "Çorum", "about": "Genç ve gelecek vaat eden başpehlivan.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/selbest.jpg" },
    { "id": 56, "name": "Hüseyin Demir", "hometown": "Antalya", "about": "Sert güreşleri seven, inatçı bir karakter.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/demir.jpg" },
    { "id": 57, "name": "Fatih Köse", "hometown": "Antalya", "about": "Antalya'nın yetiştirdiği çalışkan pehlivanlardan.", "last_5_matches": ["L", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/kose.jpg" },
    { "id": 58, "name": "Hamza Özkaradeniz", "hometown": "Kocaeli", "about": "İsmi gibi Karadeniz sertliğini güreşinde taşır.", "last_5_matches": ["W", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/hamza-oz.jpg" },
    { "id": 59, "name": "Süleyman Başar", "hometown": "Manisa", "about": "Ege'nin parlayan başaltı kökenli yıldızı.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/basar.jpg" },
    { "id": 60, "name": "Yıldıray Akın", "hometown": "Kocaeli", "about": "Puanlamada çok dikkatli, defansı kuvvetli.", "last_5_matches": ["W", "L", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/yildiray.jpg" },
    { "id": 61, "name": "Ali Gökçen", "hometown": "Manisa", "about": "Tecrübeli başpehlivan, tam bir ustalık dönemi yaşıyor.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/gokcen.jpg" },
    { "id": 62, "name": "Hasan Zeybek", "hometown": "Antalya", "about": "Hücum güreşini seven, seyir zevki yüksek pehlivan.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/hasan-z.jpg" },
    { "id": 63, "name": "Mecit Yıldırım", "hometown": "İstanbul", "about": "İstanbul'un er meydanındaki güçlü sesi.", "last_5_matches": ["L", "W", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/mecit.jpg" },
    { "id": 64, "name": "Gökhan Arıcı", "hometown": "Kocaeli", "about": "Karamürsel ekolünün emektarlarından.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/arici.jpg" },
    { "id": 65, "name": "Mustafa Kemal Karaboğa", "hometown": "Antalya", "about": "Stratejik güreşiyle tanınan usta isim.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/karaboga.jpg" },
    { "id": 66, "name": "Fatih Çakıroğlu", "hometown": "İstanbul", "about": "Minder tecrübesiyle yağda fark yaratıyor.", "last_5_matches": ["W", "L", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/cakiroglu.jpg" },
    { "id": 67, "name": "Serkan Serttürk", "hometown": "Antalya", "about": "Çalışkan ve istikrarlı, tam bir görev adamı.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/sertturk.jpg" },
    { "id": 68, "name": "Ahmet Serbest", "hometown": "Çorum", "about": "Çorumlu yiğit, gücüyle dikkat çekiyor.", "last_5_matches": ["W", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/ahmet-s.jpg" },
    { "id": 69, "name": "Ali Rıza Kaya", "hometown": "Samsun", "about": "Karadeniz'in sert ve teknik pehlivanı.", "last_5_matches": ["L", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/kaya.jpg" },
    { "id": 70, "name": "Recep Kara (Genç)", "hometown": "Ordu", "about": "İsim benzerliği olsa da kendi yolunda ilerleyen genç yetenek.", "last_5_matches": ["W", "L", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/recep-g.jpg" },
    { "id": 71, "name": "Cemali Küçükgüçlü", "hometown": "Antalya", "about": "Hızlı atakları ve çevikliğiyle tanınır.", "last_5_matches": ["L", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/cemali.jpg" },
    { "id": 72, "name": "Sefa Ümit Keskin", "hometown": "Erzurum", "about": "Erzurum'un yeni nesil temsilcilerinden.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/sefa.jpg" },
    { "id": 73, "name": "İbrahim Katkıcı", "hometown": "Antalya", "about": "Sürekli arayan, atak yapan bir güreş tarzı.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/katkici.jpg" },
    { "id": 74, "name": "Osman Aynur", "hometown": "Antalya", "about": "Eski şampiyon, tecrübesiyle gençlere rehber.", "last_5_matches": ["W", "L", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/aynur.jpg" },
    { "id": 75, "name": "Tolga Turan", "hometown": "Antalya", "about": "Başaltından başarıyla çıkan, teknik pehlivan.", "last_5_matches": ["L", "W", "W", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/tolga.jpg" },
    { "id": 76, "name": "Mustafa Arslan", "hometown": "Antalya", "about": "Çok güçlü fiziğiyle rakiplerini yoran isim.", "last_5_matches": ["W", "L", "W", "L", "L"], "photo_url": "https://img.cdn.com/pehlivan/arslan.jpg" },
    { "id": 77, "name": "Resul Yılmaz", "hometown": "Samsun", "about": "Samsunlu tecrübeli, oyun bilgisi yüksek pehlivan.", "last_5_matches": ["L", "W", "L", "W", "W"], "photo_url": "https://img.cdn.com/pehlivan/resul.jpg" },
    { "id": 78, "name": "Nadir Takı", "hometown": "Antalya", "about": "Antalya'nın istikrarlı ve teknik isimlerinden.", "last_5_matches": ["W", "L", "W", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/nadir.jpg" },
    { "id": 79, "name": "Arif Akın", "hometown": "Kocaeli", "about": "Kocaeli'nin sert ve dayanıklı başpehlivanı.", "last_5_matches": ["L", "W", "L", "L", "W"], "photo_url": "https://img.cdn.com/pehlivan/arif.jpg" },
    { "id": 80, "name": "Zeki Akın", "hometown": "Kocaeli", "about": "Sürekli hücum yapan, tribünlerin sevdiği tarz.", "last_5_matches": ["W", "W", "L", "W", "L"], "photo_url": "https://img.cdn.com/pehlivan/zeki.jpg" }
];

const generateWrestlers = (): Wrestler[] => {
    return RAW_DATA.map((item, index) => {
        const recentMatches: MatchHistory[] = item.last_5_matches.map((res, mIndex) => {
            const oppIndex = (index + mIndex * 3 + 1) % 80;
            const oppName = RAW_DATA[oppIndex].name;
            return {
                id: `m_${item.id}_${mIndex}`,
                opponentName: oppName,
                result: res === 'W' ? 'WIN' : 'LOSS',
                date: mIndex === 0 ? '7 Temmuz 2024' : (mIndex === 1 ? '6 Temmuz 2024' : 'Mayıs 2024'),
                round: mIndex === 0 ? 'Finaller' : 'Ön Turlar'
            };
        });

        let champ = "Yok";
        if (item.name === "Yusuf Can Zeybek") champ = "2023, 2024";
        if (item.name === "İsmail Balaban") champ = "2013, 2017";
        if (item.name === "Ali Gürbüz") champ = "2011, 2012, 2019, 2021";
        if (item.name === "Mustafa Taş") champ = "2022";
        if (item.name === "Orhan Okulu") champ = "2015, 2018";
        if (item.name === "Recep Kara") champ = "2004, 2007, 2008, 2016";
        if (item.name === "Mehmet Yeşil Yeşil") champ = "2009, 2010";
        if (item.name === "Şaban Yılmaz") champ = "2005";
        if (item.name === "Fatih Atlı") champ = "2014";
        if (item.name === "Osman Aynur") champ = "2006";

        let medals = { gold: 0, silver: 0, bronze: 0 };
        let totalMatches = 150 + (item.id % 50);
        let winRate = 60 + (item.id % 20);
        let imageUrl = item.photo_url;

        // Custom rich data for Yusuf Can Zeybek (ID: 1)
        if (item.name === "Yusuf Can Zeybek") {
            champ = "2023, 2024";
            medals = { gold: 12, silver: 5, bronze: 8 };
            totalMatches = 342;
            winRate = 78;
        } else if (item.name === "İsmail Balaban") {
            champ = "2013, 2017";
        } else if (item.name === "Ali Gürbüz") {
            medals = { gold: 8, silver: 3, bronze: 5 };
            totalMatches = 310;
            winRate = 82;
        } else if (item.name === "Recep Kara") {
            medals = { gold: 10, silver: 6, bronze: 4 };
            totalMatches = 380;
            winRate = 75;
        } else if (item.name === "Orhan Okulu") {
            medals = { gold: 6, silver: 4, bronze: 3 };
            totalMatches = 290;
            winRate = 73;
        } else if (item.name === "Mustafa Taş") {
            medals = { gold: 4, silver: 2, bronze: 3 };
            totalMatches = 220;
            winRate = 70;
        }

        return {
            id: item.id,
            name: item.name,
            title: "Başpehlivan",
            city: item.hometown,
            about: item.about,
            age: 28 + (item.id % 12),
            height: parseFloat((1.75 + (item.id % 20) / 100).toFixed(2)),
            weight: 95 + (item.id % 25),
            imageUrl: imageUrl,
            championships: champ,
            medals: medals,
            totalMatches: totalMatches,
            winRate: winRate,
            recentMatches: recentMatches
        };
    });
};

export const BASPEHLIVANLAR = generateWrestlers();

const generateTournament = (): TournamentMatch[] => {
    const matches: TournamentMatch[] = [];
    for (let i = 0; i < 40; i++) {
        matches.push({
            id: `match_${i + 1}`,
            round: 'KIRKPINAR 1. TUR EŞLEŞMELERİ',
            wrestler1: BASPEHLIVANLAR[i],
            wrestler2: BASPEHLIVANLAR[79 - i]
        });
    }
    return matches;
};

export const TOURNAMENT_MATCHES = generateTournament();

export const MOCK_KIRKPINAR_INFO = "Kırkpınar Yağlı Güreşleri'nin 664. sürümünde tam 80 Başpehlivan er meydanına çıkıyor. Kura çekimi sonucu oluşan 40 eşleşmeli 1. Tur maçlarına hoş geldiniz!";
