export default async (req, res) => {
  const { reqHandler } = await import('../dist/rick-morty/server/server.mjs');
  return reqHandler(req, res);
};
