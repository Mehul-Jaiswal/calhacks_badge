import { google } from 'googleapis';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Setup Google Sheets API authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SHEET_ID;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:G',
    });

    const rows = result.data.values;
    const badge = rows.find(row => row[0] === id);

    if (!badge) {
      return new Response(JSON.stringify({ error: 'Badge not found' }), { status: 404 });
    }

    const [timestamp, name, university, major, graduationDate, github, profileUrl] = badge;

    return new Response(JSON.stringify({
      id,
      name,
      university,
      major,
      graduationDate,
      github,
      profileUrl,
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching badge:', error);
    return new Response('Failed to retrieve badge', { status: 500 });
  }
}
