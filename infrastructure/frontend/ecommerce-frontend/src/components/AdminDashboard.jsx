import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Package, ShoppingCart, LogOut, Plus, Edit, Trash2, X, Upload, Home } from 'lucide-react';

const API_BASE = 'http://localhost';

// Product Form Modal
const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'tv',
    name: '',
    price: '',
    stock: '',
    category: '',
    mainCategory: '',
    description: '',
    // TV fields
    screenSize: '',
    resolution: '4K',
    smartPlatform: '',
    ports: '',
    isSmartTv: true,
    panelType: 'LED',
    hasHDR: true,
    energyClass: 'A++',
    tunerType: 'DVB-T2',
    supportedApps: '',
    // Fridge fields
    capacity: '',
    hasFreezer: true,
    doorCount: '2',
    color: '',
    features: '',
    // Dishwasher fields
    noiseLevel: '',
    hasHalfLoadOption: true,
    hasChildLock: true,
    hasDelayStart: true,
    waterConsumptionPerCycle: '',
    numberOfPrograms: '',
    dimensions: '',
    // PC fields
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    operatingSystem: '',
    screenResolution: '',
    weight: '',
    brand: '',
    model: '',
    connectivity: '',
    isLaptop: true
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  
 
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [mainCatRes, subCatRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories/main`),
          fetch(`${API_BASE}/api/categories/sub`)
        ]);
        
        const mainCatData = await mainCatRes.json();
        const subCatData = await subCatRes.json();
        
        setMainCategories(mainCatData);
        setCategories(subCatData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMainCategories(['Elektronik', 'Beyaz Eşya', 'İklimlendirme']);
        setCategories(['TV', 'Buzdolabı', 'Bulaşık Makinesi', 'Çamaşır Makinesi', 'Telefon', 'Bilgisayar']);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        type: product.type || 'tv',
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        mainCategory: product.mainCategory || '',
        description: product.description || '',
        screenSize: product.screenSize || '',
        resolution: product.resolution || '4K',
        smartPlatform: product.smartPlatform?.join(', ') || '',
        ports: product.ports?.join(', ') || '',
        isSmartTv: product.isSmartTv ?? true,
        panelType: product.panelType || 'LED',
        hasHDR: product.hasHDR ?? true,
        energyClass: product.energyClass || 'A++',
        tunerType: product.tunerType || 'DVB-T2',
        supportedApps: product.supportedApps?.join(', ') || '',
        capacity: product.capacity || '',
        hasFreezer: product.hasFreezer ?? true,
        doorCount: product.doorCount || '2',
        color: product.color || '',
        features: product.features?.join(', ') || '',
        noiseLevel: product.noiseLevel || '',
        hasHalfLoadOption: product.hasHalfLoadOption ?? true,
        hasChildLock: product.hasChildLock ?? true,
        hasDelayStart: product.hasDelayStart ?? true,
        waterConsumptionPerCycle: product.waterConsumptionPerCycle || '',
        numberOfPrograms: product.numberOfPrograms || '',
        dimensions: product.dimensions?.join(', ') || '',
        processor: product.processor || '',
        ram: product.ram || '',
        storage: product.storage || '',
        gpu: product.gpu || '',
        operatingSystem: product.operatingSystem || '',
        screenResolution: product.screenResolution || '',
        weight: product.weight || '',
        brand: product.brand || '',
        model: product.model || '',
        connectivity: product.connectivity || '',
        isLaptop: product.isLaptop ?? true
      });
      setExistingImageUrls(product.imageUrls || []);
      setImagePreviews(product.imageUrls || []);
      setImages([]);
    } else {
      setImages([]);
      setImagePreviews([]);
      setExistingImageUrls([]);
      
      if (mainCategories.length > 0 && !formData.mainCategory) {
        setFormData(prev => ({ ...prev, mainCategory: mainCategories[0] }));
      }
      if (categories.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categories[0] }));
      }
    }
  }, [product, mainCategories, categories]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...existingImageUrls, ...newPreviews]);
  };
  
  const handleRemoveImage = (url) => {
    const isExisting = existingImageUrls.includes(url);
    
    if (isExisting) {
      setExistingImageUrls(existingImageUrls.filter(u => u !== url));
      setImagePreviews(imagePreviews.filter(u => u !== url));
    } else {
      const fileToRemove = images.find(file => URL.createObjectURL(file) === url);
      if (fileToRemove) {
        setImages(images.filter(file => URL.createObjectURL(file) !== url));
        setImagePreviews(imagePreviews.filter(u => u !== url));
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    const productData = {
      type: formData.type,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      mainCategory: formData.mainCategory,
      description: formData.description,
      imageUrls: existingImageUrls, 
    };

    if (formData.type === 'tv') {
      Object.assign(productData, {
        screenSize: parseFloat(formData.screenSize),
        resolution: formData.resolution,
        smartPlatform: formData.smartPlatform.split(',').map(s => s.trim()).filter(Boolean),
        ports: formData.ports.split(',').map(s => s.trim()).filter(Boolean),
        isSmartTv: formData.isSmartTv,
        panelType: formData.panelType,
        hasHDR: formData.hasHDR,
        energyClass: formData.energyClass,
        tunerType: formData.tunerType,
        supportedApps: formData.supportedApps.split(',').map(s => s.trim()).filter(Boolean)
      });
    } else if (formData.type === 'fridge') {
      Object.assign(productData, {
        capacity: parseFloat(formData.capacity),
        hasFreezer: formData.hasFreezer,
        doorCount: parseInt(formData.doorCount),
        energyClass: formData.energyClass,
        color: formData.color,
        features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
        dimensions: formData.dimensions.split(',').map(s => parseInt(s.trim())).filter(Boolean)
      });
    } else if (formData.type === 'dishwasher') {
      Object.assign(productData, {
        energyClass: formData.energyClass,
        capacity: parseInt(formData.capacity),
        noiseLevel: parseInt(formData.noiseLevel),
        hasHalfLoadOption: formData.hasHalfLoadOption,
        hasChildLock: formData.hasChildLock,
        hasDelayStart: formData.hasDelayStart,
        waterConsumptionPerCycle: parseInt(formData.waterConsumptionPerCycle),
        numberOfPrograms: parseInt(formData.numberOfPrograms),
        dimensions: formData.dimensions.split(',').map(s => parseInt(s.trim())).filter(Boolean)
      });
    } else if (formData.type === 'pc') {
      Object.assign(productData, {
        processor: formData.processor,
        ram: formData.ram,
        storage: formData.storage,
        gpu: formData.gpu,
        operatingSystem: formData.operatingSystem,
        screenSize: formData.screenSize,
        screenResolution: formData.screenResolution,
        color: formData.color,
        weight: parseFloat(formData.weight) || 0,
        brand: formData.brand,
        model: formData.model,
        connectivity: formData.connectivity,
        ports: formData.ports.split(',').map(s => s.trim()).filter(Boolean),
        isLaptop: formData.isLaptop
      });
    }

    formDataToSend.append('product', JSON.stringify(productData));
    
    images.forEach(image => {
      formDataToSend.append('images', image);
    });

    await onSave(formDataToSend, product?.id);
    onClose();
  };

  if (!isOpen) return null;

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'tv':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Size (inch)</label>
                <input type="number" step="0.1" value={formData.screenSize} onChange={(e) => setFormData({...formData, screenSize: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <select value={formData.resolution} onChange={(e) => setFormData({...formData, resolution: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>HD</option>
                  <option>Full HD</option>
                  <option>4K</option>
                  <option>8K</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smart Platform (comma-separated)</label>
              <input type="text" value={formData.smartPlatform} onChange={(e) => setFormData({...formData, smartPlatform: e.target.value})} placeholder="Android TV, WebOS" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ports (comma-separated)</label>
              <input type="text" value={formData.ports} onChange={(e) => setFormData({...formData, ports: e.target.value})} placeholder="HDMI, USB, Ethernet" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panel Type</label>
                <select value={formData.panelType} onChange={(e) => setFormData({...formData, panelType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>LED</option>
                  <option>OLED</option>
                  <option>QLED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuner Type</label>
                <input type="text" value={formData.tunerType} onChange={(e) => setFormData({...formData, tunerType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="checkbox" checked={formData.isSmartTv} onChange={(e) => setFormData({...formData, isSmartTv: e.target.checked})} className="mr-2" />
                Smart TV
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={formData.hasHDR} onChange={(e) => setFormData({...formData, hasHDR: e.target.checked})} className="mr-2" />
                HDR
              </label>
            </div>
          </>
        );
      case 'fridge':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (L)</label>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Door Count</label>
                <input type="number" value={formData.doorCount} onChange={(e) => setFormData({...formData, doorCount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input type="text" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} placeholder="No Frost, Water Dispenser" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (H,W,D in cm)</label>
              <input type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} placeholder="180, 60, 65" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <label className="flex items-center">
              <input type="checkbox" checked={formData.hasFreezer} onChange={(e) => setFormData({...formData, hasFreezer: e.target.checked})} className="mr-2" />
              Has Freezer
            </label>
          </>
        );
      case 'dishwasher':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (person)</label>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Noise Level (dB)</label>
                <input type="number" value={formData.noiseLevel} onChange={(e) => setFormData({...formData, noiseLevel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Consumption (L/cycle)</label>
                <input type="number" value={formData.waterConsumptionPerCycle} onChange={(e) => setFormData({...formData, waterConsumptionPerCycle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programs</label>
                <input type="number" value={formData.numberOfPrograms} onChange={(e) => setFormData({...formData, numberOfPrograms: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (H,W,D in cm)</label>
              <input type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} placeholder="85, 60, 60" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="checkbox" checked={formData.hasHalfLoadOption} onChange={(e) => setFormData({...formData, hasHalfLoadOption: e.target.checked})} className="mr-2" />
                Half Load
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={formData.hasChildLock} onChange={(e) => setFormData({...formData, hasChildLock: e.target.checked})} className="mr-2" />
                Child Lock
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={formData.hasDelayStart} onChange={(e) => setFormData({...formData, hasDelayStart: e.target.checked})} className="mr-2" />
                Delay Start
              </label>
            </div>
          </>
        );
      case 'pc':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="ASUS, Lenovo, HP" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} placeholder="TUF Gaming A15" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processor *</label>
                <input type="text" value={formData.processor} onChange={(e) => setFormData({...formData, processor: e.target.value})} placeholder="Intel i7-12700H" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RAM *</label>
                <input type="text" value={formData.ram} onChange={(e) => setFormData({...formData, ram: e.target.value})} placeholder="16 GB DDR5" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage *</label>
                <input type="text" value={formData.storage} onChange={(e) => setFormData({...formData, storage: e.target.value})} placeholder="512 GB SSD" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPU</label>
                <input type="text" value={formData.gpu} onChange={(e) => setFormData({...formData, gpu: e.target.value})} placeholder="NVIDIA RTX 4060" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operating System</label>
                <input type="text" value={formData.operatingSystem} onChange={(e) => setFormData({...formData, operatingSystem: e.target.value})} placeholder="Windows 11 Home" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Size (inch)</label>
                <input type="text" value={formData.screenSize} onChange={(e) => setFormData({...formData, screenSize: e.target.value})} placeholder="15.6" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Resolution</label>
                <input type="text" value={formData.screenResolution} onChange={(e) => setFormData({...formData, screenResolution: e.target.value})} placeholder="1920x1080" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="Silver, Black" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="2.3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
                <input type="text" value={formData.connectivity} onChange={(e) => setFormData({...formData, connectivity: e.target.value})} placeholder="Wi-Fi 6, Bluetooth 5.2" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ports</label>
              <input type="text" value={formData.ports} onChange={(e) => setFormData({...formData, ports: e.target.value})} placeholder="3x USB, 1x HDMI, 1x Type-C" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <label className="flex items-center">
              <input type="checkbox" checked={formData.isLaptop} onChange={(e) => setFormData({...formData, isLaptop: e.target.checked})} className="mr-2" />
              Is Laptop (uncheck for Desktop)
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loadingCategories ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled={!!product}>
                <option value="tv">TV</option>
                <option value="fridge">Fridge</option>
                <option value="dishwasher">Dishwasher</option>
                <option value="pc">PC</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              {formData.type !== 'pc' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy Class</label>
                  <select value={formData.energyClass} onChange={(e) => setFormData({...formData, energyClass: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>A+++</option>
                    <option>A++</option>
                    <option>A+</option>
                    <option>A</option>
                    <option>B</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category *</label>
                <select 
                  value={formData.mainCategory} 
                  onChange={(e) => setFormData({...formData, mainCategory: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Main Category</option>
                  {mainCategories.map((mainCat) => (
                    <option key={mainCat} value={mainCat}>{mainCat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            {renderTypeSpecificFields()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload new images (You can select multiple)</span>
                </label>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${idx}`} 
                          className="w-full h-24 object-cover rounded-lg border" 
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveImage(preview)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition duration-200"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                {product ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      console.log("Products API response:", data);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (formData, productId) => {
    const token = localStorage.getItem('token');
    const url = productId 
      ? `${API_BASE}/api/admin/products/${productId}`
      : `${API_BASE}/api/admin/products`;
    
    const method = productId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save product: ${res.status} - ${errorText}`);
      }
      
      await fetchProducts();
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete product');
      
      await fetchProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <button 
          onClick={() => { setEditProduct(null); setShowModal(true); }} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.imageUrls?.[0] && (
                      <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 rounded object-cover mr-3" />
                    )}
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => { setEditProduct(product); setShowModal(true); }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={editProduct}
        onSave={handleSave}
      />
    </div>
  );
};

// Orders Tab Component
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update order status');
      
      await fetchOrders();
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <div className="text-sm text-gray-600">Total Orders: {orders.length}</div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id?.substring(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.shippingAddress?.fullName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.totalAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    console.log('🔍 AdminDashboard - User:', user, 'Loading:', loading);
    
    if (loading) {
      console.log('⏳ Still loading auth...');
      return;
    }
    
    if (!user) {
      console.log('❌ No user found, redirecting to home');
      navigate('/', { replace: true });
      return;
    }
    
    if (user.role !== 'ADMIN') {
      console.log('❌ Access denied. User:', user.username, 'Role:', user.role);
      navigate('/', { replace: true });
      return;
    }
    
    console.log('✅ Admin access granted:', user.username);
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Package className="w-5 h-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8 pb-12">
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;