export default async function handler(req, res) {
  const apiKey = process.env.CLICKUP_API_KEY;
  const teamId = '90151302562';
  const folderId = '901515642734';

  try {
    let allTasks = [];
    let page = 0;
    let keepFetching = true;

    // Bucle para pedir todas las páginas (Máximo 10 páginas = 1000 tiquets para evitar bloqueos)
    while (keepFetching && page < 10) { 
      const response = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/task?folder_ids%5B%5D=${folderId}&subtasks=true&include_closed=true&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`ClickUp respondió con estado: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.tasks && data.tasks.length > 0) {
        allTasks = allTasks.concat(data.tasks); // Juntamos los tiquets
        if (data.tasks.length < 100) {
          keepFetching = false; // Si trae menos de 100, es la última página
        } else {
          page++; // Pasar a la siguiente página
        }
      } else {
        keepFetching = false;
      }
    }
    
    // Filtros de seguridad para que Vercel nunca use Caché antigua
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({ tasks: allTasks });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
