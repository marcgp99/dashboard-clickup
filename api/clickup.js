export default async function handler(req, res) {
  const apiKey = process.env.CLICKUP_API_KEY;
  const teamId = '90151302562';
  const folderId = '901515642734';

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/task?folder_ids%5B%5D=${folderId}&subtasks=true&include_closed=false`, {
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
    
    // ESTO ES LO NUEVO: Obligamos a Vercel a no cachear nunca esta respuesta
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
