
# ConversionCraft – War Room (Public Edition)

**The ultimate AI-powered competitor intelligence engine.**

The War Room is a forensic tactical analysis tool designed for e-commerce entrepreneurs. It goes beyond basic SWOT analysis to provide actionable "Attack Plans," estimated traffic data, and creative counter-strategies.

## 🚀 Features

*   **Threat Radar**: Identify direct competitors and analyze their market positioning.
*   **Forensic Traffic Intel**: Estimate competitor monthly visits, bounce rates, and ad spend.
*   **Creative Intelligence**: Reverse-engineer ad hooks and generate AI "Counter-Hooks" to beat them.
*   **Tactical Attack Plan**: A prioritized checklist of actions to capture market share.
*   **SEO Battlefield**: Analyze organic vs. paid keyword strategies.
*   **Social Footprint**: Track social media growth and engagement.

## 🛠️ Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/conversioncraft-war-room.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Backend Setup (Crucial)**:
    *   This app requires a backend proxy to handle AI requests securely.
    *   Deploy the `api/analyze.ts` file to Vercel (It works automatically as an API Route).
    *   **Set your `API_KEY` in your Vercel environment variables.**
4.  **Frontend Setup**:
    *   Run the frontend:
    ```bash
    npm run dev
    ```

## 🛡️ API Security

This public edition is architected for security.
*   **No Client-Side Keys**: The frontend (`CompetitorIntel.tsx`) contains **zero** API keys or sensitive logic.
*   **Proxy Architecture**: All analysis requests are routed through the secure backend (`api/analyze.ts`), ensuring your credentials remain private.

## ⚠️ Disclaimer

This is a restricted public release focusing solely on the War Room module. Other modules (Product Finder, Auto-Pilot, Creative Studio) are disabled in this version.
