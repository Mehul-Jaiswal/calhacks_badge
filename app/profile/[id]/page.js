import { google } from 'googleapis';
import Image from 'next/image';
import Head from 'next/head';


export default async function Profile({ params }) {
  const { id } = params;  // Get the ID from the URL

  // Setup Google Sheets API authentication (or your preferred data source)
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SHEET_ID;

  // Fetch the badge data from Google Sheets (or another data source)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A:H',  // Adjust this range based on your spreadsheet structure
  });

  const rows = res.data.values;
  const profile = rows.find(row => row[0] === id);  // Find the profile by ID

  if (!profile) return <div>Profile not found</div>;

  const [_, name, university, major, graduationDate, github, profileUrl, qrCode] = profile;

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center">
      {/* Meta Tags */}
      <Head>
        <title>{name}'s Badge | CalHacks</title>
        <meta name="description" content={`View ${name}'s hacker badge for CalHacks.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.jpg" />
      </Head>

      {/* Top Bar with Logo */}
      <header className="bg-blue-600 text-white p-4 w-full flex items-center justify-between">
        <div className="flex items-center">
        <Image src="/logo.jpg" alt="CalHacks Logo" width={48} height={48} className="rounded-full mr-4" />
          <h1 className="text-3xl font-bold">CalHacks</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-blue-50 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">{name}'s Hacker Badge</h1>

        {/* Profile Details */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-blue-700 mb-2"><strong>Name:</strong> {name}</p>
          <p className="text-lg font-semibold text-blue-700 mb-2"><strong>University:</strong> {university}</p>
          <p className="text-lg font-semibold text-blue-700 mb-2"><strong>Major:</strong> {major}</p>
          <p className="text-lg font-semibold text-blue-700 mb-2"><strong>Graduation Date:</strong> {graduationDate}</p>
          <p className="text-lg font-semibold text-blue-700 mb-2">
            <strong>GitHub:</strong> {github ? <a href={github} target="_blank" rel="noopener noreferrer">{github}</a> : 'N/A'}
          </p>
        </div>

        {/* QR Code */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Scan Your Badge</h2>
          <Image src={qrCode} alt={`${name}'s QR Code`} width={200} height={200} className="border border-blue-300 rounded shadow-md mx-auto" />

        </div>
      </div>
    </div>
  );
}
