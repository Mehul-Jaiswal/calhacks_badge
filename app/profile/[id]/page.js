import { google } from 'googleapis';
import Head from 'next/head';
import Image from 'next/image'; // Use Next.js Image for other static images

export default async function Profile({ params }) {
  const { id } = params;  // Get the ID from the URL

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

  // Fetch the badge data from Google Sheets (including the additional fields)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A:L',  // Adjust this range to include the additional columns
  });

  const rows = res.data.values;
  const profile = rows.find(row => row[0] === id);  // Find the profile by ID

  if (!profile) return <div>Profile not found</div>;

  const [_, name, university, major, graduationDate, github, profileUrl, qrCode, profilePhoto, skills, interests, yearInCollege] = profile;

  // Ensure profilePhoto is a valid URL or fallback
  const validProfilePhoto = profilePhoto?.startsWith('http') ? profilePhoto : '/placeholder-profile.png'; // Fallback to placeholder if invalid

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      {/* Meta Tags */}
      <Head>
        <title>{name}&#39;s Badge | CalHacks</title>
        <meta name="description" content={`View ${name}&#39;s hacker badge for CalHacks.`} />
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
      <div className="flex w-full max-w-4xl mt-8">
        {/* Badge Section (Left) */}
        <div className="w-1/2 bg-blue-50 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">{name}&#39;s Hacker Badge</h1>

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

          {/* QR Code - Use <img> for base64 data */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Scan Your Badge</h2>
            <img src={qrCode} alt={`${name}&#39;s QR Code`} className="border border-blue-300 rounded shadow-md mx-auto" />
          </div>
        </div>

        {/* Profile Information Section (Right) */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-start ml-8">
          {/* Profile Photo */}
          {validProfilePhoto && (
            <div className="mb-6">
              <Image src={validProfilePhoto} alt={`${name}'s Profile Photo`} width={150} height={150} className="rounded-full shadow-md" />
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Skills</h3>
            <p className="text-lg text-gray-700">{skills || 'No skills provided'}</p>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Interests</h3>
            <p className="text-lg text-gray-700">{interests || 'No interests provided'}</p>
          </div>

          {/* Year in College */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Year in College</h3>
            <p className="text-lg text-gray-700">{yearInCollege || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
