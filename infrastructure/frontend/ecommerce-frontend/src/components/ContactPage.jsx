import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      content: 'Göktürk Merkez Mah. Teknoloji Cad. No:21, Eyüpsultan/İstanbul',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: '0216 123 21 21\n0850 XXX XX XX',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mail,
      title: 'E-posta',
      content: 'info@htech.com.tr\ndestek@htech.com.tr',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: 'Pazartesi - Cumartesi: 09:00 - 22:00\nPazar: 10:00 - 20:00',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">İletişim</h1>
            <p className="text-xl text-white/90">
              Size nasıl yardımcı olabiliriz? Bizimle iletişime geçin!
            </p>
          </motion.div>
        </div>
      </div>

      {/* İletişim Bilgileri */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${info.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                <info.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{info.content}</p>
            </motion.div>
          ))}
        </div>

        {/* İletişim Formu & Harita */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
              
              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                  Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mesaj konusu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Gönder
                </button>
              </form>
            </div>
          </motion.div>

          {/* Harita */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bizi Ziyaret Edin</h2>
              <div className="w-full h-[400px] bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d750.7294505337195!2d28.88893702639161!3d41.17995999809345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDEwJzQ3LjkiTiAyOMKwNTMnMjIuNiJF!5e0!3m2!1str!2sus!4v1761529176375!5m2!1str!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HTech Konum"
                ></iframe>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-gray-600">
                  <strong className="text-gray-900">Adres:</strong> Göktürk Merkez Mah. Teknoloji Cad. No:21, Eyüpsultan/İstanbul
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-900">Toplu Taşıma:</strong> Göktürk Metro - 5 dk yürüme mesafesi
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-900">Otopark:</strong> Ücretsiz müşteri otoparkı mevcut
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SSS Önizleme */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-gray-600 mb-8">
            Aradığınız cevabı bulamadınız mı? SSS sayfamıza göz atın!
          </p>
          <a
            href="/sss"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            SSS Sayfasına Git
          </a>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;