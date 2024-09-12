import { google } from 'googleapis';
import QRCode from 'qrcode';

export async function POST(req) {
  try {
    const { name, university, major, graduationDate, github } = await req.json();

    // Server-side validation for required fields
    if (!name || !university || !major || !graduationDate) {
      return new Response('All fields except GitHub are required', { status: 400 });
    }

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

    // Fetch all existing badge data to check if the user already generated a badge
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:H', 
    });

    const rows = res.data.values;
    // Check if a user with the same Name, University, and GitHub already exists
    const userExists = rows.some(row => row[1] === name && row[2] === university && row[5] === github);

    if (userExists) {
      return new Response(JSON.stringify({ error: 'User has already generated a badge' }), { status: 400 });
    }

    const id = Date.now().toString();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const profileUrl = `${baseUrl}/profile/${id}`;
    const qrCode = await QRCode.toDataURL(profileUrl);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [id, name, university, major, graduationDate, github || '', profileUrl, qrCode],
        ],
      },
    });

    return new Response(JSON.stringify({ id, profileUrl, qrCode }), { status: 200 });
  } catch (error) {
    console.error('Error creating badge:', error);
    return new Response('Failed to create badge', { status: 500 });
  }
}
