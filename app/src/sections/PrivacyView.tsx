import { Card, CardContent } from '@/components/ui/card';

export function PrivacyView() {
  return (
    <div className="animate-fadeIn min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Kebijakan Privasi
          </h1>
          <p className="text-gray-600">Terakhir diperbarui: 2 Maret 2026</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. Data yang Dikumpulkan</h2>
              <p>
                Kami mengumpulkan data yang Anda berikan saat checkout seperti nama, email, nomor telepon,
                alamat, serta informasi pesanan untuk memproses layanan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Penggunaan Data</h2>
              <p>
                Data digunakan untuk pemrosesan pesanan, konfirmasi pembayaran, pengiriman notifikasi,
                dan peningkatan kualitas layanan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Penyimpanan dan Keamanan</h2>
              <p>
                Kami menerapkan langkah teknis yang wajar untuk melindungi data pelanggan dan membatasi
                akses hanya untuk kebutuhan operasional.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Berbagi Data</h2>
              <p>
                Data pelanggan tidak diperjualbelikan. Data hanya dibagikan ke layanan pihak ketiga yang
                diperlukan untuk operasional (misalnya notifikasi atau hosting), sesuai kebutuhan layanan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Hak Pengguna</h2>
              <p>
                Anda dapat menghubungi kami untuk memperbarui atau meminta penghapusan data pelanggan,
                sepanjang tidak bertentangan dengan kewajiban operasional atau hukum yang berlaku.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
