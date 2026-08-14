# Privacy Policy — PEMTREE (Web App)

**App:** PEMTREE (USAC Study Tree / Curriculum Graph)  
**Platform:** Web App (`https://pemtree.netlify.app/`)  
**Developer / Administrator:** Trebol4Devop (Independent Community Project)  
**Target Audience:** Students, faculty, and academic community of the Faculty of Engineering at Universidad de San Carlos de Guatemala (FIUSAC)  
**Last Updated:** August 13, 2026  
**Effective Date:** August 13, 2026  

---

## 1. General Information and Institutional Disclaimer

This Privacy Policy describes how **PEMTREE** ("the Platform", "the Web App", "we", "our", "us"), developed and maintained by the community initiative **Trebol4Devop**, collects, stores, processes, and protects information from users ("you") when visiting and using our official web application at [https://pemtree.netlify.app/](https://pemtree.netlify.app/).

### Institutional Disclaimer and Nature of the Service
PEMTREE is an independent, open-source project created by students for the student and academic community of the **Faculty of Engineering at Universidad de San Carlos de Guatemala (FIUSAC)**.

- **No Institutional Affiliation:** PEMTREE is **not** formally affiliated with, endorsed by, administratively tied to, or an official representative of Universidad de San Carlos de Guatemala (USAC) or its faculty authorities.
- **Informational Purpose:** Curriculum paths (pensum CLAR 2022/2025), course codes, prerequisites, and class schedules displayed are public, informative academic data intended solely for pedagogical guidance and course planning.

---

## 2. Privacy Architecture and Hybrid Operational Model

PEMTREE is built upon the core principles of **privacy by design and data minimization**:
- **Anonymous, Local-First Academic Tools:** The Curriculum Tree Visualizer, the Semester/Vacation Planner, and the Schedule Builder operate 100% locally on the user's client device without requiring account creation, registration, or transmission of personal data to external servers.
- **Authenticated Community Tools:** The student discussion forum, comment posting, instructor/TA rating and recommendations, WhatsApp study groups directory, and web push notifications require voluntary authentication via Google OAuth to safeguard community integrity and prevent abuse, vandalism, or spam.

---

## 3. Anonymous Use and Local Storage (localStorage)

You can freely use the core academic utilities of PEMTREE anonymously without providing any personal data:

1. **Curriculum Graph Visualizer:** Marking completed courses, in-progress courses, checking unlocked prerequisites, and calculating critical graduation paths.
2. **Semester & Vacation Planner:** Organizing and projecting coursework across academic semesters and vacation terms.
3. **Schedule Builder (ScheduleBuilder):** Selecting course sections, viewing assigned lecturers, and automatically detecting schedule time overlaps.

### Storage Mechanics
All data related to the above utilities is stored **strictly and exclusively in your web browser's local storage (`localStorage`)**. These records are never sent, sold, or synced to any centralized database.

**Technical keys utilized in `localStorage`:**
- `pemtree_progreso_<pensumKey>`: JSON array containing course codes marked as approved or in-progress for the selected engineering program.
- `pemtree_plan`: JSON object containing the user's custom distribution of planned courses across terms.
- `pemtree_pensum_actual`: Active curriculum configuration identifier (e.g., `ciencias_y_sistemas_22.json`).
- `pemtree_theme`: User interface appearance preference (`"dark"` or `"light"`).
- `pemtree_guia_visto`: Boolean flag to prevent repetitive display of the introductory guide modal.
- `pemtree_last_post_timestamp` / `pemtree_last_comment_timestamp`: Local timestamps used for anti-spam rate limiting and cooldown enforcement.

> **User Control & Deletion:** You can erase all local data at any time by clearing your browser cache and site data, or by using the reset options provided within the application settings.

---

## 4. Authenticated Use and Identity Management (OAuth 2.0)

To participate in social and community features, users may voluntarily sign in.

### Identity Provider
- **Provider:** Google LLC managed through **Supabase Auth**.
- **Protocol:** Industry-standard OAuth 2.0 (Google Sign-In).

### Personal Data Collected via Google OAuth:
- **Universal Unique Identifier (UUID):** System-generated unique identifier (`auth.users.id`).
- **Full Name / Public Display Name:** Provided by your Google account profile (`name` / `full_name`).
- **Email Address:** Verified primary email address linked to your Google account (`email`).
- **Profile Picture (Avatar):** Public image URL from your Google account avatar (`avatar_url`).

### Legitimate Purposes of Account Data Processing:
- Accurately attributing ownership of forum posts, comments, and submitted study group links.
- Powering the personal dashboard ("My Posts") to enable editing or deleting your submissions.
- Preventing automated bot abuse, denial-of-service attacks, identity spoofing, and forum spam.
- Preventing duplicate voting or reputation tampering on instructor evaluations.
- Facilitating direct alerts and notifications regarding replies to your inquiries.

---

## 5. User-Generated Content (UGC)

When interacting in community spaces, the platform handles the following user data:

### A. Community Discussion Forum
- **Posts and Replies:** Subject titles, text descriptions, markdown formatting, associated academic categories, and degree programs.
- **Image Attachments:** Images uploaded by users are processed, compressed, and optimized in the browser prior to being transmitted to secure cloud object storage (Supabase Storage).
- **Reactions & Upvotes ("Likes"):** Bound uniquely to the authenticated user ID to ensure a single vote per person per post and prevent artificial vote manipulation.

### B. Lecturer and Teaching Assistant Reviews
- **Evaluation Mechanism:** Structured boolean feedback (Recommend: Yes / No). Open-ended freeform text commentary is intentionally omitted to protect academic personnel from defamatory remarks, harassment, or unsubstantiated claims.
- **Uniqueness Constraint:** Each rating is strictly restricted to one vote per instructor per authenticated user via composite database unique keys `(docente_id, user_id)`.
- **Privacy & Aggregation:** The public view (`docente_reputation`) exposes only aggregated statistical metrics (total ratings, recommend count, and percentage score). Individual voting records remain private and are never exposed with voter identity to other users.

### C. Collaborative WhatsApp Study Groups Directory
- **Public Group Links:** Direct invitation URLs (`chat.whatsapp.com`) categorized by career program, course, or semester level.
- **Submission Metadata:** Group title, description, academic tag, and author user ID.
- **Utility Votes & Issue Reports:** Community-driven upvoting and flagging system for expired links or inappropriate content.
- **External Privacy Notice:** PEMTREE only facilitates the external invitation hyperlink. It does not monitor, access, store, or process private WhatsApp messages, member contact rosters, or media shared within WhatsApp chats.

### D. Community Moderation and Reporting System
- Users can flag content that violates community guidelines or legal standards.
- Logged data: Reporter user ID, reported content/user entity ID, category/reason description, and timestamp.

---

## 6. Web Push Notifications

PEMTREE provides an optional, opt-in push notification feature to deliver real-time notifications when your forum posts receive responses:

- **Technology:** Implemented via W3C Web Push API, Service Workers (`/sw.js`), and VAPID protocol specifications (RFC 8292).
- **Explicit Consent:** Notifications are activated solely upon explicit permission granted by the user via native browser prompt (`Notification.requestPermission()`).
- **Stored Subscription Data (`notification_subscriptions`):**
  - Authenticated user ID (`user_id`).
  - Unique delivery endpoint URL (`endpoint`) assigned by the browser push service (e.g., Google FCM, Mozilla Push Service, Apple Web Push).
  - End-to-end cryptographic keys (`p256dh` and `auth`).
  - Technical client identifier string (`user_agent`).
- **Opt-Out & Revocation:** You may revoke push notification permissions at any moment from the Notifications section in PEMTREE or directly within your browser site permissions.

---

## 7. Third-Party Service Providers (Subprocessors)

To maintain platform availability, data security, and high performance, PEMTREE relies on trusted infrastructure providers:

| Provider | Service / Purpose | Processing & Security | Privacy Policy |
|---|---|---|---|
| **Supabase Inc.** | PostgreSQL Database, Supabase Auth (OAuth 2.0), Storage, and Edge Functions. | Secure cloud hosting with encryption in transit (TLS/HTTPS) and at rest. Strict RLS enabled. | [Supabase Privacy Policy](https://supabase.com/privacy) |
| **Netlify Inc.** | Static site hosting, global CDN edge delivery, and SSL management. | Global edge network with standard web access and security logs. | [Netlify Privacy Policy](https://www.netlify.com/privacy/) |
| **Google LLC** | Federated authentication (Google Sign-In) and Google AdSense monetization (`ca-pub-8195828335046911`). | Secure OAuth management and standard digital advertising delivery to support hosting costs. | [Google Privacy & Terms](https://policies.google.com/privacy) |
| **Meta Platforms Inc. / WhatsApp** | External redirection to student study groups. | Hyperlink redirection. PEMTREE does not handle or store WhatsApp internal chat data. | [WhatsApp Privacy Policy](https://www.whatsapp.com/legal/privacy-policy) |

---

## 8. Cookies and Web Storage

- **First-Party Cookies:** PEMTREE **does not** use invasive first-party tracking cookies or cross-site behavioral profiling. `localStorage` is used purely to remember interface settings and local academic progress.
- **Third-Party Cookies and Storage:**
  - **Supabase Auth:** Persists secure, encrypted JWT authentication tokens in web storage to maintain your logged-in session.
  - **Google AdSense:** Google and third-party advertising partners may place cookies or web beacons to serve advertisements based on prior visits to this or other websites.
  - **Managing Ad Preferences:** You can opt out of personalized advertising by visiting [Google Ad Settings](https://adssettings.google.com/) or via [aboutads.info](https://www.aboutads.info/choices/).

---

## 9. Security Measures and Data Protection

We employ modern cryptographic, technical, and architectural safeguards to protect user data:

1. **Encryption in Transit (HTTPS/TLS):** All data transferred between your browser, Netlify's global CDN, and Supabase servers is protected using modern TLS/SSL encryption.
2. **Row-Level Security (RLS):** Our Supabase database enforces granular Row-Level Security rules:
   - Anonymous visitors can only read approved public data.
   - Authenticated users can only update or delete their own submissions, comments, and group links.
   - Administrative and moderation actions require privileged `SECURITY DEFINER` functions with rigorous role verification.
3. **Automated Content Moderation & Rate Limiting:**
   - Automated keyword filtering against inappropriate language, flooding, spam patterns, and unauthorized links.
   - Comprehensive content state lifecycle tracking (`PENDING`, `APPROPRIATE`, `INAPPROPRIATE`, `ERROR`).
   - Anti-spam cooldown timers enforced on both client and database levels.

---

## 10. User Rights (Access, Rectification, Erasure, and Control)

As a PEMTREE user, you retain complete authority over your personal information:

- **Access and Update:** You can review, edit, and manage all your submissions at any time in the **"My Posts"** section.
- **Content Deletion:** You can delete your forum posts, comments, or shared WhatsApp links whenever you choose. Deleted items are immediately removed from public display.
- **Local Right to be Forgotten:** You can erase all your course progress, planner data, and schedules by clearing your browser cache and local storage.
- **Notification Opt-Out:** You can disable web push notifications instantly via browser settings.
- **Account Deletion:** If you wish to permanently delete your user account and all associated records from our backend database, contact our administrator through the official channels.

---

## 11. Children's Privacy

PEMTREE is designed for university-level higher education students and faculty (individuals aged 13 and older). We do not knowingly collect personal information from children under 13 without appropriate parental or legal consent. If you believe such data has been collected inadvertently, please contact us immediately for prompt deletion.

---

## 12. Changes to This Privacy Policy

We may periodically revise this Privacy Policy to reflect architectural improvements, new features, or statutory updates. Material changes will be marked with an updated "Last Updated" date at the top of this document. We encourage users to review this page periodically.

---

## 13. Contact and Support Channels

For questions, privacy inquiries, data deletion requests, or security notices, please contact us via:

- **Email:** [trebol4devop@proton.me](mailto:trebol4devop@proton.me)
- **Official GitHub Repository:** [https://github.com/Trebol4Devop/PEMTREE](https://github.com/Trebol4Devop/PEMTREE)
- **Official Web Application:** [https://pemtree.netlify.app/](https://pemtree.netlify.app/)
- **Privacy Center:** [https://politicasdeprivacidad.netlify.app/](https://politicasdeprivacidad.netlify.app/)
