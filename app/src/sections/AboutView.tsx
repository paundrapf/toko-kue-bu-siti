import { Heart, Award, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { siteSettings } from '@/data/products';

export function AboutView() {
  const values = [
    {
      icon: Heart,
      title: 'Dibuat dengan Cinta',
      description: 'Setiap kue kami buat dengan penuh cinta dan perhatian, seperti membuat kue untuk keluarga sendiri.'
    },
    {
      icon: Award,
      title: 'Bahan Berkualitas',
      description: 'Kami hanya menggunakan bahan-bahan premium dan segar untuk hasil terbaik.'
    },
    {
      icon: Users,
      title: 'Pelayanan Ramah',
      description: 'Tim kami siap membantu Anda dengan senyum dan pelayanan terbaik.'
    },
    {
      icon: Clock,
      title: 'Tepat Waktu',
      description: 'Kami memahami pentingnya waktu, pesanan Anda akan sampai tepat waktu.'
    }
  ];

  const milestones = [
    { year: '2004', title: 'Awal Mula', description: 'Toko Kue Bu Siti didirikan dari dapur rumah' },
    { year: '2010', title: 'Pindah ke Toko', description: 'Membuka toko pertama di lokasi strategis' },
    { year: '2015', title: 'Ekspansi', description: 'Menambah varian produk dan layanan delivery' },
    { year: '2020', title: 'Go Online', description: 'Meluncurkan website dan layanan online' },
    { year: '2024', title: '20 Tahun', description: 'Merayakan 20 tahun melayani pelanggan setia' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <div className="relative h-80 md:h-96">
        <img
          src="/images/hero/hero-1.jpg"
          alt="Toko Kue Bu Siti"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Tentang Kami
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Cerita kami, cita rasa yang menginspirasi
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#FF6B9D] font-medium">Cerita Kami</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                20 Tahun Menyajikan Kelezatan
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Toko Kue Bu Siti didirikan pada tahun 2004 dengan cinta dan passion untuk baking. 
                  Berawal dari dapur kecil di rumah, kami memulai perjalanan dengan membuat kue untuk 
                  keluarga dan tetangga.
                </p>
                <p>
                  Seiring berjalannya waktu, kue-kue buatan kami semakin dikenal dan permintaan pun 
                  semakin banyak. Dengan tekad untuk memberikan yang terbaik, kami terus mengembangkan 
                  resep dan teknik baking.
                </p>
                <p>
                  Kini, setelah 20 tahun, Toko Kue Bu Siti telah menjadi salah satu toko kue favorit 
                  di Jakarta. Kami bersyukur memiliki tim yang hebat dan pelanggan setia yang telah 
                  mendukung kami sepanjang perjalanan ini.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/hero/hero-2.jpg"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#FF6B9D] text-white p-6 rounded-xl">
                <p className="text-4xl font-bold">20+</p>
                <p className="text-sm">Tahun Pengalaman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#FFF8E7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prinsip yang kami pegang teguh dalam setiap kue yang kami buat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-[#FF6B9D]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perjalanan Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Milestone penting dalam perjalanan Toko Kue Bu Siti
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-[#FF6B9D] rounded-full" />
                  {idx < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-[#FF6B9D] font-bold text-lg">{milestone.year}</span>
                  <h3 className="font-semibold text-xl mt-1">{milestone.title}</h3>
                  <p className="text-gray-600 mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#FF6B9D]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl md:text-5xl font-bold">5000+</p>
              <p className="text-white/80 mt-2">Pelanggan Puas</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">50+</p>
              <p className="text-white/80 mt-2">Varian Kue</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">100%</p>
              <p className="text-white/80 mt-2">Homemade</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">20+</p>
              <p className="text-white/80 mt-2">Tahun Berdiri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-[#FF6B9D]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Alamat</h3>
                <p className="text-gray-600">{siteSettings.address}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-[#FF6B9D]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Telepon</h3>
                <p className="text-gray-600">{siteSettings.phone}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-[#FF6B9D]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600">{siteSettings.email}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
