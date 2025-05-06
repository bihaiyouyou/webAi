export async function onRequest({request, env}) {
  try {
    // 克隆原始请求，但确保不使用错误的URL
    const newRequest = new Request(request);
    
    // 直接使用Worker绑定，不指定任何URL路径
    return await env.API.fetch(newRequest);
  } catch (error) {
    // 返回格式化的错误
    return new Response(JSON.stringify({
      error: "处理请求失败",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}