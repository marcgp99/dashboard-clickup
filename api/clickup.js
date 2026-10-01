export default async function handler(req, res) {
  // Leemos el token que pusiste en Vercel
  const apiKey = process.env.CLICKUP_API_KEY;
  // El ID de tu lista de Producción
  const listId = '901510789406';

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true&include_closed=false`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`ClickUp respondió con estado: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
