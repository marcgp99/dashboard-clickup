export default async function handler(req, res) {
  const apiKey = process.env.CLICKUP_API_KEY;
  // El ID de tu espacio de trabajo (Team ID)
  const teamId = '90151302562';
  // El ID de la carpeta de producción
  const folderId = '901515642734';

  try {
    // Usamos el endpoint para buscar tareas dentro de una carpeta específica
    const response = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/task?folder_ids%5B%5D=${folderId}&subtasks=true&include_closed=true`, {
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
