import { motion } from 'framer-motion';
import { ChevronDown, Package, CreditCard, Truck, RefreshCw, Shield, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      title: 'Sipariş ve Teslimat',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      faqs: [
        {
          question: 'Siparişim ne zaman teslim edilir?',
          answer: 'Siparişiniz onaylandıktan sonra 1-3 iş günü içerisinde kargoya verilir. Kargo süresi bölgenize göre 1-3 gün arasında değişmektedir.'
        },
        {
          question: 'Kargo ücreti ne kadardır?',
          answer: 'Tüm siparişlerinizde kargo tamamen ücretsizdir. Minimum sipariş tutarı bulunmamaktadır.'
        },
        {
          question: 'Siparişimi nasıl takip edebilirim?',
          answer: 'Hesabım > Siparişlerim bölümünden sipariş durumunuzu ve kargo takip numaranızı görebilirsiniz.'
        }
      ]
    },
    {
      title: 'Ödeme Yöntemleri',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      faqs: [
        {
          question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kullanabilirsiniz. Tüm kartlar için taksit imkanı mevcuttur.'
        },
        {
          question: 'Taksit yapabilir miyim?',
          answer: 'Evet, kredi kartınıza göre 2-12 aya varan taksit seçenekleri sunuyoruz. Ödeme sayfasında taksit seçeneklerini görebilirsiniz.'
        },
        {
          question: 'Ödeme güvenli mi?',
          answer: 'Tüm ödemeleriniz 256-bit SSL sertifikası ile şifrelenmektedir ve 3D Secure sistemi ile korunmaktadır.'
        }
      ]
    },
    {
      title: 'İade ve Değişim',
      icon: RefreshCw,
      color: 'from-purple-500 to-purple-600',
      faqs: [
        {
          question: 'Ürünü iade edebilir miyim?',
          answer: 'Evet, cayma hakkınızı kullanarak 14 gün içerisinde ücretsiz olarak iade edebilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.'
        },
        {
          question: 'İade süreci nasıl işler?',
          answer: 'Müşteri hizmetlerimizle iletişime geçerek iade talebinizi oluşturun. Size bir iade kodu vereceğiz ve kargo ücretsiz olarak ürünü teslim alacaktır.'
        },
        {
          question: 'Paramı ne zaman geri alırım?',
          answer: 'İade ürününüz depoya ulaştıktan sonra 3-5 iş günü içerisinde ödemeniz iade edilir.'
        }
      ]
    },
    {
      title: 'Garanti ve Servis',
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      faqs: [
        {
          question: 'Ürünlerde garanti süresi ne kadar?',
          answer: 'Tüm ürünlerimizde minimum 2 yıl resmi distribütör garantisi bulunmaktadır. Bazı ürünlerde garanti süresi daha uzun olabilir.'
        },
        {
          question: 'Garanti kapsamında neler var?',
          answer: 'Üretim hatalarından kaynaklanan tüm arızalar garanti kapsamındadır. Fiziksel darbeler ve kullanıcı hatası garanti kapsamı dışındadır.'
        },
        {
          question: 'Servis hizmeti veriyor musunuz?',
          answer: 'Evet, tüm ürünlerimiz için yetkili servis ağımız bulunmaktadır. Garanti kapsamındaki arızalarda servis ücretsizdir.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const index = `${categoryIndex}-${faqIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Sıkça Sorulan Sorular</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Aklınıza takılan soruların cevaplarını burada bulabilirsiniz
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Kategorileri */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Kategori Başlığı */}
              <div className={`bg-gradient-to-r ${category.color} text-white p-6`}>
                <div className="flex items-center gap-4">
                  <category.icon className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
              </div>

              {/* FAQs */}
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const isOpen = openIndex === `${categoryIndex}-${faqIndex}`;
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-left font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hala Yardım mı Lazım? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center mt-12"
        >
          <h3 className="text-2xl font-bold mb-4">Sorunuz cevap bulamadınız mı?</h3>
          <p className="text-white/90 mb-6">
            Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar
          </p>
          <a
            href="/iletisim"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Bize Ulaşın
          </a>
        </motion.div>
      </div>
    </div>
  );
};
export default FAQPage;