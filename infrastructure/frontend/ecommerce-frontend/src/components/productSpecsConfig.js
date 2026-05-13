// Product Specifications Configuration
export const PRODUCT_SPECS_CONFIG = {
  tv: {
    title: "TV Teknik Özellikleri",
    icon: "tv",
    gradient: "from-blue-600 to-purple-600",
    specs: [
      { 
        key: 'screenSize', 
        label: 'Ekran Boyutu', 
        suffix: '"', 
        color: 'blue',
        type: 'text',
        filterable: true,
        filterOptions: ['32', '43', '50', '55', '65', '75', '85']
      },
      { 
        key: 'resolution', 
        label: 'Çözünürlük', 
        color: 'green',
        type: 'text',
        filterable: true,
        filterOptions: ['HD', 'Full HD', '4K', '8K']
      },
      { 
        key: 'panelType', 
        label: 'Panel Tipi', 
        color: 'purple',
        type: 'text',
        filterable: true,
        filterOptions: ['LED', 'OLED', 'QLED', 'NanoCell']
      },
      { 
        key: 'isSmartTv', 
        label: 'Smart TV', 
        color: 'red',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'hasHDR', 
        label: 'HDR Desteği', 
        color: 'yellow',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'energyClass', 
        label: 'Enerji Sınıfı', 
        color: 'indigo',
        type: 'energy-class',
        filterable: true,
        filterOptions: ['A+++', 'A++', 'A+', 'A', 'B']
      },
      { 
        key: 'tunerType', 
        label: 'Tuner Tipi', 
        color: 'pink',
        type: 'text',
        filterable: true,
        filterOptions: ['DVB-T2', 'DVB-S2', 'DVB-C', 'Hibrit']
      }
    ],
    sections: [
      {
        key: 'smartPlatform',
        label: 'Smart Platform',
        type: 'tags',
        color: 'blue',
        bgColor: 'blue-50',
        borderColor: 'blue-100',
        iconColor: 'blue-600',
        tagBgColor: 'blue-100',
        tagTextColor: 'blue-800',
        filterable: true,
        filterOptions: ['Android TV', 'WebOS', 'Tizen', 'Roku OS', 'Fire TV']
      },
      {
        key: 'ports',
        label: 'Bağlantı Portları',
        type: 'tags',
        color: 'green',
        bgColor: 'green-50',
        borderColor: 'green-100',
        iconColor: 'green-600',
        tagBgColor: 'green-100',
        tagTextColor: 'green-800',
        filterable: true,
        filterOptions: ['HDMI', 'USB', 'Ethernet', 'Wi-Fi', 'Bluetooth']
      },
      {
        key: 'supportedApps',
        label: 'Desteklenen Uygulamalar',
        type: 'tags',
        color: 'purple',
        bgColor: 'purple-50',
        borderColor: 'purple-100',
        iconColor: 'purple-600',
        tagBgColor: 'purple-100',
        tagTextColor: 'purple-800',
        filterable: true,
        filterOptions: ['Netflix', 'YouTube', 'Prime Video', 'Disney+', 'Apple TV+']
      }
    ]
  },
  
  fridge: {
    title: "Buzdolabı Teknik Özellikleri",
    icon: "refrigerator",
    gradient: "from-cyan-600 to-blue-600",
    specs: [
      { 
        key: 'capacity', 
        label: 'Kapasite', 
        suffix: ' L', 
        color: 'cyan',
        type: 'text',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 100, max: 800, step: 50 }
      },
      { 
        key: 'hasFreezer', 
        label: 'Dondurucu', 
        color: 'blue',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'doorCount', 
        label: 'Kapı Sayısı', 
        suffix: ' Kapı', 
        color: 'green',
        type: 'text',
        filterable: true,
        filterOptions: ['1', '2', '3', '4']
      },
      { 
        key: 'energyClass', 
        label: 'Enerji Sınıfı', 
        color: 'yellow',
        type: 'energy-class',
        filterable: true,
        filterOptions: ['A+++', 'A++', 'A+', 'A', 'B']
      },
      { 
        key: 'color', 
        label: 'Renk', 
        color: 'purple',
        type: 'text',
        filterable: true,
        filterOptions: ['Beyaz', 'Siyah', 'Gri', 'Paslanmaz Çelik', 'Bej']
      },
      { 
        key: 'dimensions', 
        label: 'Boyutlar', 
        color: 'indigo',
        type: 'dimensions',
        formatter: (value) => value ? `${value.join(' × ')} cm` : 'Belirtilmemiş',
        helpText: 'Y × G × D'
      }
    ],
    sections: [
      {
        key: 'features',
        label: 'Özel Özellikler',
        type: 'feature-list',
        color: 'cyan',
        bgColor: 'cyan-50',
        borderColor: 'cyan-100',
        iconColor: 'cyan-600',
        filterable: true,
        filterOptions: ['No Frost', 'Antibakteriyel', 'Çok Bölmeli', 'Sebze Bölmesi', 'LED Aydınlatma']
      }
    ]
  },
  
  dishwasher: {
    title: "Bulaşık Makinesi Teknik Özellikleri",
    icon: "dishwasher",
    gradient: "from-teal-600 to-emerald-600",
    specs: [
      { 
        key: 'capacity', 
        label: 'Kapasite', 
        suffix: ' Kişilik', 
        color: 'teal',
        type: 'text',
        filterable: true,
        filterOptions: ['6', '8', '10', '12', '14', '16']
      },
      { 
        key: 'energyClass', 
        label: 'Enerji Sınıfı', 
        color: 'green',
        type: 'energy-class',
        filterable: true,
        filterOptions: ['A+++', 'A++', 'A+', 'A', 'B']
      },
      { 
        key: 'noiseLevel', 
        label: 'Gürültü Seviyesi', 
        suffix: ' dB', 
        color: 'blue',
        type: 'noise-level',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 35, max: 55, step: 5 }
      },
      { 
        key: 'waterConsumptionPerCycle', 
        label: 'Su Tüketimi', 
        suffix: ' L/Çevrim', 
        color: 'cyan',
        type: 'text',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 6, max: 18, step: 1 }
      },
      { 
        key: 'numberOfPrograms', 
        label: 'Program Sayısı', 
        suffix: ' Program', 
        color: 'purple',
        type: 'text',
        filterable: true,
        filterOptions: ['3', '4', '5', '6', '7', '8+']
      },
      { 
        key: 'dimensions', 
        label: 'Boyutlar', 
        color: 'indigo',
        type: 'dimensions',
        formatter: (value) => value ? `${value.join(' × ')} cm` : 'Belirtilmemiş',
        helpText: 'Y × G × D'
      },
      { 
        key: 'hasHalfLoadOption', 
        label: 'Yarım Yük', 
        color: 'yellow',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'hasChildLock', 
        label: 'Çocuk Kilidi', 
        color: 'red',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'hasDelayStart', 
        label: 'Erteleme Başlatma', 
        color: 'pink',
        type: 'boolean',
        filterable: true
      }
    ],
    sections: []
  },

  pc: {
    title: "PC/Laptop Teknik Özellikleri",
    icon: "laptop",
    gradient: "from-slate-600 to-gray-700",
    specs: [
      { 
        key: 'brand', 
        label: 'Marka', 
        color: 'slate',
        type: 'text',
        filterable: true,
        filterOptions: ['ASUS', 'Lenovo', 'HP', 'Dell', 'MSI', 'Acer', 'Apple', 'Razer']
      },
      { 
        key: 'model', 
        label: 'Model', 
        color: 'gray',
        type: 'text',
        filterable: false
      },
      { 
        key: 'isLaptop', 
        label: 'Tip', 
        color: 'blue',
        type: 'boolean',
        filterable: true,
        trueLabel: 'Laptop',
        falseLabel: 'Masaüstü'
      },
      { 
        key: 'processor', 
        label: 'İşlemci', 
        color: 'red',
        type: 'text',
        filterable: true,
        filterOptions: ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3']
      },
      { 
        key: 'ram', 
        label: 'RAM', 
        color: 'green',
        type: 'text',
        filterable: true,
        filterOptions: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB']
      },
      { 
        key: 'storage', 
        label: 'Depolama', 
        color: 'yellow',
        type: 'text',
        filterable: true,
        filterOptions: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD', '1 TB HDD', '2 TB HDD']
      },
      { 
        key: 'gpu', 
        label: 'Ekran Kartı', 
        color: 'purple',
        type: 'text',
        filterable: true,
        filterOptions: ['Entegre', 'NVIDIA GTX', 'NVIDIA RTX', 'AMD Radeon']
      },
      { 
        key: 'operatingSystem', 
        label: 'İşletim Sistemi', 
        color: 'indigo',
        type: 'text',
        filterable: true,
        filterOptions: ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'Chrome OS']
      },
      { 
        key: 'screenSize', 
        label: 'Ekran Boyutu', 
        suffix: ' inç',
        color: 'cyan',
        type: 'text',
        filterable: true,
        filterOptions: ['13.3', '14', '15.6', '17.3', '24', '27', '32']
      },
      { 
        key: 'screenResolution', 
        label: 'Ekran Çözünürlüğü', 
        color: 'teal',
        type: 'text',
        filterable: true,
        filterOptions: ['1366x768', '1920x1080', '2560x1440', '3840x2160']
      },
      { 
        key: 'color', 
        label: 'Renk', 
        color: 'pink',
        type: 'text',
        filterable: true,
        filterOptions: ['Siyah', 'Gri', 'Gümüş', 'Beyaz', 'Mavi']
      },
      { 
        key: 'weight', 
        label: 'Ağırlık', 
        suffix: ' kg',
        color: 'orange',
        type: 'text',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 1, max: 5, step: 0.5 }
      },
      { 
        key: 'connectivity', 
        label: 'Bağlantı', 
        color: 'lime',
        type: 'text',
        filterable: false
      }
    ],
    sections: [
      {
        key: 'ports',
        label: 'Bağlantı Portları',
        type: 'tags',
        color: 'slate',
        bgColor: 'slate-50',
        borderColor: 'slate-100',
        iconColor: 'slate-600',
        tagBgColor: 'slate-100',
        tagTextColor: 'slate-800',
        filterable: true,
        filterOptions: ['USB 3.0', 'USB-C', 'HDMI', 'DisplayPort', 'Ethernet', 'Audio Jack', 'SD Card']
      }
    ]
  },

  washingMachine: {
    title: "Çamaşır Makinesi Teknik Özellikleri",
    icon: "washing-machine",
    gradient: "from-indigo-600 to-purple-600",
    specs: [
      { 
        key: 'capacity', 
        label: 'Kapasite', 
        suffix: ' kg', 
        color: 'indigo',
        type: 'text',
        filterable: true,
        filterOptions: ['5', '6', '7', '8', '9', '10', '11', '12']
      },
      { 
        key: 'energyClass', 
        label: 'Enerji Sınıfı', 
        color: 'green',
        type: 'energy-class',
        filterable: true,
        filterOptions: ['A+++', 'A++', 'A+', 'A', 'B']
      },
      { 
        key: 'spinSpeed', 
        label: 'Sıkma Hızı', 
        suffix: ' rpm', 
        color: 'blue',
        type: 'text',
        filterable: true,
        filterOptions: ['800', '1000', '1200', '1400', '1600']
      },
      { 
        key: 'waterConsumption', 
        label: 'Su Tüketimi', 
        suffix: ' L', 
        color: 'cyan',
        type: 'text',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 30, max: 80, step: 5 }
      },
      { 
        key: 'noiseLevel', 
        label: 'Gürültü Seviyesi', 
        suffix: ' dB', 
        color: 'purple',
        type: 'noise-level',
        filterable: true,
        filterType: 'range',
        filterOptions: { min: 45, max: 75, step: 5 }
      },
      { 
        key: 'hasInverterMotor', 
        label: 'Inverter Motor', 
        color: 'red',
        type: 'boolean',
        filterable: true
      },
      { 
        key: 'hasSteamFunction', 
        label: 'Buhar Fonksiyonu', 
        color: 'yellow',
        type: 'boolean',
        filterable: true
      }
    ],
    sections: [
      {
        key: 'programs',
        label: 'Yıkama Programları',
        type: 'tags',
        color: 'indigo',
        bgColor: 'indigo-50',
        borderColor: 'indigo-100',
        iconColor: 'indigo-600',
        tagBgColor: 'indigo-100',
        tagTextColor: 'indigo-800',
        filterable: true,
        filterOptions: ['Pamuk', 'Sentetik', 'Yün', 'İpek', 'Hızlı Yıkama', 'Eco', 'Anti-Alerjik']
      }
    ]
  }
};

export const getFilterableSpecs = (productType) => {
  const config = PRODUCT_SPECS_CONFIG[productType];
  if (!config) return [];
  
  const filterableSpecs = [];
  
  config.specs.forEach(spec => {
    if (spec.filterable) {
      filterableSpecs.push({
        ...spec,
        category: 'specs'
      });
    }
  });
  
  config.sections.forEach(section => {
    if (section.filterable) {
      filterableSpecs.push({
        ...section,
        category: 'sections'
      });
    }
  });
  
  return filterableSpecs;
};

export const getAllFilterableSpecs = () => {
  const allSpecs = {};
  
  Object.keys(PRODUCT_SPECS_CONFIG).forEach(productType => {
    allSpecs[productType] = getFilterableSpecs(productType);
  });
  
  return allSpecs;
};