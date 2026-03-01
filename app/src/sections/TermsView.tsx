import { Card, CardContent } from '@/components/ui/card';

export function TermsView() {
  return (
    <div className="animate-fadeIn min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Syarat dan Ketentuan
          </h1>
          <p className="text-gray-600">Terakhir diperbarui: 2 Maret 2026</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. Ketentuan Umum</h2>
              <p>
                Dengan melakukan pemesanan di Toko Kue Bu Siti, Anda menyetujui ketentuan layanan,
                proses pembayaran, serta kebijakan pengiriman yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Pemesanan dan Pembayaran</h2>
              <p>
                Pesanan dianggap valid setelah nomor pesanan diterbitkan. Untuk transfer bank,
                pelanggan wajib mengunggah bukti pembayaran melalui halaman lacak pesanan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Produksi dan Pengiriman</h2>
              <p>
                Waktu pengerjaan mengikuti ketersediaan slot produksi dan jadwal pengiriman.
                Keterlambatan akibat kondisi di luar kendali operasional akan diinformasikan kepada pelanggan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Pembatalan</h2>
              <p>
                Pembatalan pesanan diproses sesuai status order. Pesanan yang sudah masuk tahap produksi
                dapat dikenakan kebijakan pembatalan khusus.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Kontak</h2>
              <p>
                Untuk pertanyaan terkait pesanan, silakan hubungi tim kami melalui WhatsApp atau email
                yang tertera pada halaman kontak.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
