# ParikshaMitra - Setup Guide 🚀

Follow these steps to deploy and manage your exam-prep super app.

## 1. Google Sheets CMS Setup
Create a new Google Sheet with the following tabs:

### Tab 1: `quizzes`
| examType | subject | title | durationMinutes | questionsCount | questionsJson |
|----------|---------|-------|-----------------|----------------|---------------|
| SSC      | GK      | History | 10            | 5              | [...]         |

### Tab 2: `affairs`
| date | titleEn | titleHi | contentEn | contentHi | category |
|------|---------|---------|-----------|-----------|----------|
| ...  | ...     | ...     | ...       | ...       | ...      |

### Tab 3: `jobs`
| title | department | qualification | lastDate | applyLink |
|-------|------------|---------------|----------|-----------|
| ...   | ...        | ...           | ...      | ...       |

---

## 2. Google Apps Script Automation
Open your Google Sheet, go to **Extensions > Apps Script**, and paste the following code:

```javascript
/**
 * PARIKSHA MITRA AUTOMATION SCRIPT
 */

const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // Get from newsapi.org
const SHEET = SpreadsheetApp.getActiveSpreadsheet();

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Pariksha Mitra')
    .addItem('Update Current Affairs', 'fetchCurrentAffairs')
    .addItem('Sync Job Alerts', 'fetchJobAlerts')
    .addToUi();
}

/**
 * Fetches news related to Indian Exams/Education
 */
function fetchCurrentAffairs() {
  const url = `https://newsapi.org/v2/everything?q=UPSC SSC Exam India&language=en&apiKey=${NEWS_API_KEY}`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  
  const sheet = SHEET.getSheetByName('affairs');
  data.articles.slice(0, 5).forEach(article => {
    sheet.appendRow([
      new Date().toISOString(),
      article.title,
      "Hindi Title Placeholder", // Use Translation API for real Hindi
      article.description,
      "Hindi Content Placeholder",
      "National"
    ]);
  });
}

/**
 * Trigger this daily using "Triggers" (Clock icon in sidebar)
 */
function dailyTrigger() {
  fetchCurrentAffairs();
  fetchJobAlerts();
}

function fetchJobAlerts() {
  // Logic to scrape or fetch from Govt API
  console.log("Job alerts sync triggered");
}
```

---

## 3. GitHub Pages Deployment
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Source: **GitHub Actions** (recommended for Vite/React).
4. Use the `Static Web App` template or configure a direct build.

---

## 4. Razorpay Integration (Placeholder)
In `Settings.tsx`, use this logic for payments:

```javascript
const handlePayment = () => {
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: 9900, // INR in paisa (99 Rs)
    currency: "INR",
    name: "ParikshaMitra Premium",
    description: "Unlimited Mock Tests",
    handler: function(response) {
      alert("Payment Successful! ID: " + response.razorpay_payment_id);
      // Update premium state in localStorage
    }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

---

## 5. PWA Support
Your app is already configured with:
- `manifest.json`: For "Add to Home Screen".
- `service-worker.js`: For basic offline caching of assets.
