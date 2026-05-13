import { useState, useEffect } from 'react';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call with mock data
    const mockProducts = [
      { id: '1', name: 'Laptop', price: 15000 },
      { id: '2', name: 'Mouse', price: 150 },
      { id: '3', name: 'Keyboard', price: 400 },
      { id: '4', name: 'Monitor', price: 3000 }
    ];
    setProducts(mockProducts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!selectedProductId) {
      setError('Lütfen bir ürün seçin');
      return;
    }
    
    if (quantity < 1) {
      setError('Adet en az 1 olmalıdır');
      return;
    }

    setLoading(true);
    
    try {
      const order = {
        items: [
          {
            productId: selectedProductId,
            quantity: parseInt(quantity)
          }
        ]
      };

      // Simulate API call
      console.log('Gönderilen sipariş:', order);
      
      // Mock successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Sipariş başarıyla oluşturuldu!");
      
      // Reset form
      setSelectedProductId('');
      setQuantity(1);
      
    } catch (err) {
      console.error('Sipariş hatası:', err);
      setError('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sipariş Ver</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Seç:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">-- Ürün Seçin --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price}₺
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adet:
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Sipariş Özeti:</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Ürün:</strong> {selectedProduct.name}</p>
              <p><strong>Birim Fiyat:</strong> {selectedProduct.price}₺</p>
              <p><strong>Adet:</strong> {quantity}</p>
              <p className="text-lg font-bold text-gray-800 mt-2">
                <strong>Toplam:</strong> {totalPrice}₺
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || !selectedProductId}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            loading || !selectedProductId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Sipariş Veriliyor...' : 'Sipariş Ver'}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;