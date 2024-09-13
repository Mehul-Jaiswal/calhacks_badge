# CalHacks Badge Generator

This project is a full-stack application that allows hackers to generate badges with QR codes for CalHacks events. Each badge is unique and provides information such as name, university, major, and a link to the hacker's GitHub profile. The QR code links to a unique profile page displaying the hacker's information, and additional details such as skills, interests, and year in college.

---

## **Features**
- Badge creation with user details.
- Generates QR code that links to the hacker's profile page.
- Integrates with Google Sheets API to store and retrieve badge information.
- Displays hacker profiles with photo, skills, interests, and year in college.

---

## **Setup Instructions**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **Google Cloud Account** with a Google Sheets API project setup.
- **Google Service Account** for authentication with the Google Sheets API.
  
### **1. Clone the Repository**
```bash
git clone <repository-url>
cd hacker-badge-system
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Google Sheets API**
1. Create a **Google Sheets** spreadsheet with the following columns:  
   `Badge ID | Name | University | Major | Graduation Date | GitHub | Profile URL | QR Code | Profile Photo | Skills | Interests | Year in College`
   
2. In **Google Cloud Console**, create a new **Service Account** with access to the Google Sheets API.
   
3. Generate a private key for your service account, and download it as a JSON file.
   
4. Share your Google Sheets with the service account email as an editor.

### **4. Set Up Environment Variables**

Create a `.env.local` file in the root directory with the following variables:

```bash
GOOGLE_CLIENT_EMAIL=<Your Google Service Account Client Email From the JSON>
GOOGLE_PRIVATE_KEY=<Your Google Service Account Private Key From the JSON>
SHEET_ID=<ID from the URL of the Sheet>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Ensure the `GOOGLE_PRIVATE_KEY` includes newlines properly by replacing `\\n` with `\n`. It should be in format: "-----BEGIN PRIVATE KEY-----\Private Key Here\n-----END PRIVATE KEY-----\n". Remember to put it in " ".

### **5. Run the Development Server**
To start the development server on `http://localhost:3000`:

```bash
npm run dev
```

---

## **Approach to the Challenge**

### **1. Frontend Development**
- Developed the form to collect user data including name, university, major, graduation date, and GitHub profile.
- Generated QR codes using the **`qrcode`** package, and displayed the generated badge along with the QR code.
- Fetched additional user details (profile photo, skills, interests, year in college) from Google Sheets and displayed them on the profile page. If not provide will say No xyz provided


### **2. Backend Development**
- Utilized **Next.js API routes** to handle the backend logic.
- Integrated **Google Sheets API** for storing and retrieving badge data, using a service account for authentication.
- Checked if a user already exists in the sheet to prevent duplicate badge creation.

### **3. Error Handling**
- Implemented server-side validation to ensure all required fields are filled.
- Added error messages for cases where the badge already exists or if any field is missing.

---

## **What I Would Do with More Time**

1. **Error Handling & User Feedback**
   - Improve error feedback for users, such as showing a pop-up message or form error handling for specific issues like missing fields or invalid data.

2. **Design Improvements**
   - Refine the UI/UX by adding more sophisticated styling, including animations, better mobile responsiveness, and interactive elements to enhance user experience.
   - Implement a theme switcher to support light and dark mode based on user preferences.

3. **Profile Customization**
   - Allow users to upload custom profile photos or use social media profiles to auto-populate fields like GitHub or LinkedIn.
   - Provide the option to edit and update existing badges.

4. **Security Enhancements**
   - Implement authentication for users generating badges to prevent abuse.
   - Add rate-limiting and input validation at the backend to ensure secure and efficient handling of API requests.
---
