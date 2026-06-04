const handler = {
  async fetch(request: Request, env: { TELEGRAM_BOT_TOKEN: string; TELEGRAM_CHAT_ID: string }): Promise<Response> {
    const url = new URL(request.url);

    // Only handle POST /api/contact
    if (request.method !== 'POST' || url.pathname !== '/api/contact') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const product = formData.get('product') as string;
      const message = formData.get('message') as string;
      const image = formData.get('image') as File | null;

      if (!name || !phone || !email || !product || !message) {
        return new Response(JSON.stringify({ error: 'Vui lòng điền đầy đủ thông tin.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (image && image.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File quá lớn (tối đa 5MB).' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const botToken = env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID;

      const text = `📩 YÊU CẦU TƯ VẤN MỚI\n\n👤 Họ và tên: ${name}\n📧 Email: ${email}\n📱 Điện thoại: ${phone}\n📦 Sản phẩm: ${product}\n\n💬 Nội dung:\n${message}`;

      const msgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      });

      if (!msgRes.ok) {
        return new Response(JSON.stringify({ error: 'Không thể gửi tin nhắn.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (image && image.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (validTypes.includes(image.type)) {
          const imgForm = new FormData();
          imgForm.append('chat_id', chatId);
          imgForm.append('photo', image, image.name);
          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: imgForm,
          });
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Lỗi server: ' + (err as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

export default handler;