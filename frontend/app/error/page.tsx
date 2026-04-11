import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="flex-1 flex justify-center items-center min-h-screen">
      <section className="max-w-md w-full mx-auto text-center p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f33] mb-4">
          404 – Không tìm thấy trang
        </h1>
        <p className="text-[#595b61] text-lg mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được xóa.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-[#3647dc] text-[#f3f1ff] hover:bg-[#8c98ff] transition-all"
        >
          <span className="material-symbols-outlined">home</span>
          Về trang chủ
        </Link>
      </section>
    </main>
  );
}
