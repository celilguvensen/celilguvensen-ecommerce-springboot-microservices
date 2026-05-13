import { motion } from 'framer-motion';
import { Award, Users, Heart, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Müşteri Memnuniyeti',
      desc: 'Müşterilerimizin memnuniyeti bizim en büyük önceliğimiz'
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      desc: 'Güvenilir ve kaliteli hizmet sunmayı taahhüt ediyoruz'
    },
    {
      icon: Zap,
      title: 'Yenilikçilik',
      desc: 'Teknolojinin gücünü müşterilerimize en iyi şekilde sunuyoruz'
    },
    {
      icon: Award,
      title: 'Kalite',
      desc: 'Sadece en kaliteli ürünleri müşterilerimize sunuyoruz'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Mutlu Müşteri' },
    { number: '10K+', label: 'Ürün Çeşidi' },
    { number: '5+', label: 'Yıllık Deneyim' },
    { number: '99%', label: 'Memnuniyet' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 rounded-3xl mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              HTech olarak, teknolojinin gücünü herkesin evine taşımak için çalışıyoruz
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hikayemiz */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              2018 yılında küçük bir ekiple başladığımız yolculuğumuzda, teknolojinin herkes için 
              erişilebilir olması gerektiğine inandık. Bugün binlerce müşterimize hizmet veren, 
              Türkiye'nin önde gelen elektronik perakende markalarından biri olduk.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Müşteri memnuniyetini her zaman ön planda tutarak, en kaliteli ürünleri en uygun 
              fiyatlarla sunmayı hedefliyoruz. Geniş ürün yelpazemiz ve profesyonel ekibimizle 
              sizlere en iyi alışveriş deneyimini yaşatmak için çalışıyoruz.
            </p>
            <p className="text-gray-600 leading-relaxed">
              HTech ailesi olarak, teknolojinin hayatı kolaylaştıran gücüne inanıyor ve 
              bu gücü sizlerle buluşturmak için her gün daha iyisini yapmaya çalışıyoruz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <Users className="w-32 h-32 text-white" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="bg-white rounded-3xl py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Değerlerimiz */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Değerlerimiz</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;