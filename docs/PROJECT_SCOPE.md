# Nova - Project Scope

---

## **IMPORTANT: PROJECT CONTINUITY**  
To maintain project context across conversations, always start a new chat with the following instructions:

```
You are working on the Nova project
Read CHANGELOG.md and PROJECT_SCOPE.md now, report your findings, and strictly follow all instructions found in these documents.  
You must complete the check-in process before proceeding with any task.  

Begin check-in process and document analysis.
```

---

## **IMPORTANT: SELF-MAINTENANCE INSTRUCTIONS**

### **Before Taking Any Action or Making Suggestions**  
1. **Read Both Files**:  
   - Open and review `CHANGELOG.md` and `PROJECT_SCOPE.md`.  
   - Immediately report:  
     ```
     Initializing new conversation...  
     Read [filename]: [key points relevant to current task]  
     Starting conversation history tracking...
     ```

2. **Review Context**:  
   - Assess existing features, known issues, and architectural decisions from previous documentation.

3. **Inform Responses**:  
   - Use the gathered context to guide your suggestions or actions in a manner consistent with project goals.

4. **Proceed Only After Context Review**:  
   - Ensure that all actions align with Nova’s overall scope and continuity requirements.

### **After Making ANY Code Changes**  
1. **Update Documentation Immediately**:  
   - Add new features/changes to the `[Unreleased]` section of `CHANGELOG.md`.  
   - Update `PROJECT_SCOPE.md` if there are alterations to architecture, features, or limitations.

2. **Report Documentation Updates**:  
   - Use the following format to report updates:  
     ```
     Updated CHANGELOG.md: [details of what changed]  
     Updated PROJECT_SCOPE.md: [details of what changed] (if applicable)
     ```

3. **Ensure Alignment**:  
   - Verify that all changes align with existing architecture and user requirements.

4. **Document All Changes**:  
   - Include specific details about:
     - New features or improvements
     - Bug fixes
     - Error handling changes
     - UI/UX updates
     - Technical implementation details

5. **Adhere to the Read-First/Write-After Approach**:  
   - Maintain explicit update reporting for consistency and project continuity.

---

## **Project Overview**

Nova is a premium web application designed to empower German expats—especially high-income owner expats—by providing tailored, personal financial advisory services. The core functionality centers on a multi-step form that collects detailed financial data from users and, using AI-powered analysis, generates a personalized PDF audit report. This report highlights potential annual savings and optimizes investment strategies in light of German financial legislation, ultimately reducing costly human involvement in the advisory process.

---

## **Core Objectives**

1. **Free Initial Audit:**  
   - Offer a personalized tax and financial optimization report generated via AI.  
   - Example tagline: “Discover How to Save €10k+ Annually in 15 Minutes.”

2. **Guarantee Transparency:**  
   - Uphold a “No-Jargon, No-Commission” promise to build trust and counter the inherent skepticism toward traditional financial advisors.

3. **Empower Informed Decisions:**  
   - Provide clear, actionable insights into the financial and tax advantages available under German law for expats.

4. **Reduce Costly Human Intervention:**  
   - Streamline processes to minimize the need for intensive manual involvement while maintaining a high degree of personalization.

5. **Optimize Efficiency:**  
   - Enhance operational efficiency for both advisors and clients through automated, data-driven analysis and reporting.

---

## **Technical Architecture**

### **Platform & Infrastructure**
- **Framework & IDE:**  
  - Built using modern web development frameworks (e.g., React/Vue/Angular or SvelteKit) within the Cursor IDE environment.
- **Cloud Infrastructure:**  
  - Deployed on scalable cloud platforms (AWS, GCP, or Azure) with strict adherence to GDPR and security best practices.
- **Database:**  
  - Utilize a secure SQL database (e.g., PostgreSQL or MySQL) to store user profiles, financial data, audit results, and PDF reports.
- **Security & Compliance:**  
  - Ensure data encryption (both at rest and in transit), regular security audits, and full GDPR compliance.

### **Integrations**
- **AI & ML Engines:**  
  - Integration with AI engines for dynamic financial calculations and personalized report generation.
- **PDF Generation:**  
  - Leverage PDF libraries (e.g., PDFKit or jsPDF) to automate the creation of high-quality, downloadable reports.
- **Authentication Services:**  
  - Implement secure user authentication (e.g., OAuth, JWT) for protected user sessions.
- **Third-Party Financial Data:**  
  - Integrate with APIs that offer real-time financial data and market insights (where applicable).

---

## **Functions**

### **Multi-Step Form**
- **Components:**  
  - **Personal Data Input:** Collect basic information such as name, contact details, and expat status.
  - **Financial Data Input:** Capture income, expenses, current investments, and liabilities.
  - **Financial Instrument Selection:** Allow users to choose among various financial products tailored to their profile.
  - **Review & Submit:** Provide a final review screen summarizing inputs and projected savings before submission.
- **Features:**  
  - Form state persistence, dynamic field validations, and conditional logic based on user input.
  - Progress indicators and user-friendly navigation to guide users through the process.

### **PDF Generation Engine**
- **Components:**  
  - **Template Module:** A customizable report template that dynamically incorporates user-specific data.
  - **Engine Module:** Automates the conversion of form data and AI calculations into a professionally formatted PDF.
- **Features:**  
  - On-demand PDF creation immediately after form submission.
  - Options to download the report or have it securely emailed to the user.
  - Archival system to store historical reports for future reference.

### **AI-Powered Financial Audit**
- **Components:**  
  - **Calculation Engine:** Processes user input against complex financial models to generate savings estimates and optimization advice.
  - **Natural Language Generator:** Creates easy-to-understand explanations that accompany the quantitative data.
- **Features:**  
  - Real-time recalculation as users modify inputs.
  - Detailed breakdowns of potential savings, tax benefits, and investment returns.
  - Clear visualization of how small changes can lead to substantial annual savings.

### **Dashboard & User Management**
- **User Features:**  
  - Personalized dashboard displaying previous audit reports, savings over time, and recommended financial instruments.
  - Secure login and session management with a straightforward, intuitive interface.
- **Admin Features:**  
  - An administrative panel to manage financial instruments, update calculation models, and monitor user interactions.
  - Comprehensive analytics to track user engagement and audit report performance.

---

## **Data Structures**

- **UserProfile:**  
  - Stores personal details, login credentials, and session information.
- **FinancialAudit:**  
  - Contains the computed details such as current tax burdens, projected savings, and recommended financial instruments.
- **InstrumentDetails:**  
  - Defines parameters and specifics of each financial product available.
- **AuditHistory:**  
  - Logs all generated PDF reports, including timestamps and version histories.
- **SessionData:**  
  - Maintains state during multi-step form interactions, ensuring data persistence and smooth user experience.

---

## **Feature Details**

### **Multi-Step Form Workflow**
- **Personal Data Module:**  
  - Collects user identity and background information with robust input validation.
- **Financial Data Module:**  
  - Accepts detailed financial inputs, including variable fields for income, expenditures, and liabilities.
- **Instrument Selection Module:**  
  - Offers a curated list of financial instruments tailored to the user's profile.
- **Review & Submit Module:**  
  - Provides a comprehensive summary of inputs and interactive feedback on potential savings, ensuring users can review and edit before final submission.

### **Dynamic PDF Report Generation**
- **Report Template:**  
  - A flexible, modular design that adjusts to display key data points and personalized recommendations.
- **Generation Process:**  
  - Triggers an automated workflow that integrates AI calculations into the report before converting it to a PDF.
- **Distribution:**  
  - Offers multiple delivery options: direct download, secure email, or cloud storage access for later retrieval.

### **AI Financial Audit Module**
- **Calculation Engine:**  
  - Employs complex financial models to compare current scenarios with optimized financial strategies.
- **Report Narration:**  
  - Generates plain-language insights and actionable advice that demystifies financial jargon.
- **Real-Time Adjustments:**  
  - Allows for immediate recalculations as users interact with the form, providing a dynamic and engaging experience.

### **Infrastructure & Security**
- **Database Architecture:**  
  - A secure, relational database architecture ensuring fast query performance and data integrity.
- **Cloud Deployment:**  
  - Utilizes containerized environments and serverless functions to ensure scalability and resilience.
- **Security Protocols:**  
  - Implements strict access controls, encryption protocols, and regular vulnerability assessments to safeguard user data.
- **Performance Optimization:**  
  - Load balancing, caching strategies, and redundant systems ensure the application remains fast and reliable under heavy usage.

---

## **Future Enhancements**

1. **Personalized Advisor Matching:**  
   - Integrate features to connect users with specialized financial advisors based on audit outcomes.
2. **Advanced Analytics Dashboard:**  
   - Expand the dashboard to include deeper insights into user financial trends and long-term savings.
3. **Mobile App Integration:**  
   - Develop companion mobile applications for on-the-go access and real-time notifications.
4. **API Integrations:**  
   - Enhance the platform with third-party financial data providers for live market updates and additional analytics.
5. **User Feedback Loop:**  
   - Incorporate an in-app feedback mechanism to continuously improve the AI algorithms and overall user experience.
6. **International Expansion:**  
   - Consider tailoring the platform for other expatriate communities with similar financial advisory needs.

---

## **Positioning Statement**

Nova is dedicated to providing tailored personal financial advisory for high-income owner expats who remain unaware of the nuanced financial and tax advantages available in Germany. By delivering an AI-generated free initial audit report that clearly outlines potential savings—often exceeding €10k annually—and adhering to a “No-Jargon, No-Commission” promise, Nova minimizes expensive human intervention and maximizes operational efficiency, thereby revolutionizing the financial advisory landscape.

---

## **Documentation and Version Control**

- **CHANGELOG.md:**  
  - Document every code change, new feature, and bug fix in the `[Unreleased]` section.
- **PROJECT_SCOPE.md:**  
  - Update architectural decisions, feature details, and limitations whenever modifications occur.
- **Continuous Updates:**  
  - Follow the read-first/write-after approach to ensure complete and current documentation.
- **Version Control:**  
  - Use Git (or equivalent) to track all changes with detailed commit messages and regular code reviews.

  A monorepo setup using a modern web framework (likely SvelteKit, React, Vue, or Angular based on the project description)

Key folders and files:

/src: For all source code

/docs: For documentation including CHANGELOG.md and PROJECT_SCOPE.md

/tests: For unit and integration tests

/public: For static assets

.gitignore: To exclude unnecessary files

README.md: With project overview and setup instructions

package.json: For dependencies and scripts

.env.example: For environment variable templates

CI/CD configuration (e.g. GitHub Actions) for automated testing and deployment

Branch protection rules to ensure code quality

To clone and start:

Create a new repo on GitHub with this structure

Clone it locally: git clone https://github.com/your-username/nova-project.git

cd into the project: cd nova-project

Install dependencies: npm install or yarn install

Start the development server: npm run dev or yarn dev

Remember to regularly update CHANGELOG.md and PROJECT_SCOPE.md as you develop.
