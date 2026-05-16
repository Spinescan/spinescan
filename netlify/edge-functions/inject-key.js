export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;
  
  const text = await response.text();
  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY') || '';
  const injected = text.replace(
    '<script>',
    `<script>window.ANTHROPIC_KEY="${apiKey}";</script><script>`
  );
  
  return new Response(injected, {
    status: response.status,
    headers: response.headers
  });
};
