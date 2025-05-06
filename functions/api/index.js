export async function onRequest({request, env}) {
  try {
    // 获取原始URL并移除/api前缀
    const url = new URL(request.url);
    const newPath = url.pathname.replace(/^\/api/, "");
    
    // 构建新的请求URL，指向Worker但保留路径和查询参数
    const newUrl = new URL(newPath, url.origin);
    newUrl.search = url.search;
    
    // 创建修改过URL的新请求，保留原始请求的所有其他属性
    const newRequest = new Request(newUrl, request);
    
    // 添加调试头，帮助排查问题
    newRequest.headers.set('X-Original-URL', url.toString());
    newRequest.headers.set('X-New-URL', newUrl.toString());
    
    // 转发到Worker处理
    return await env.API.fetch(newRequest);
  } catch (error) {
    // 返回详细的错误信息
    return new Response(JSON.stringify({
      error: "处理请求失败",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}