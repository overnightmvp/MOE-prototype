Project Structure Changes 
analyse and plan these changes

0. add global rule to prompt a git commit everytime a task on taskmaster is completed.
1. remove file from project claude_framework_delivery.md # AI delivery framework
2. i created a template folder to root and put files there we can use as asset/snippet library.
4. rename sprint0-checklist.html to sprint0-magnet-checklist.html, create a template for sprint0-magnet-checklist.html name it template-checklist and create the pages for all other sprints, make sure to have navigation in between them and use reusable components. Adapt design where necessary but keep the experience consistent and help the user visualise current and global progress with ux best practices.
5. create a template from sprint0-onboarding.html name it template-onboarding and create the pages for all other sprints, make sure to have navigation in between them and use reusable components. Adapt design where necessary but keep the experience consistent and help the user visualise current and global progress with ux best practices.
5.a.  for sprint0 create a section on the bottom where the user can input all credentials and keys needed for the project and generate a credentials.md he can copy.
6. create a landing page and page using the template-onboarding file for this file mvp-validation-checklist.md
7. replace stripe with polar.sh 
8. organise and link pages based on this structure, ask questions to clarify and suggest optimal structure. top funnel:  index.html, sprint0-checklist.html,sprint1-checklist.html,sprint2-checklist.html ... / once email is collected > success.html > sprint0-onboarding 
8.a add domain purchase and setup to sprint 0 
9. create sitemap and create a dashboard to visualise it, keep it minimal and simple.
10. create a version of customer_journey_blueprint.md for this project
11. test changes,update project files so is consistent, commit changes.
12. analyse the project for inconsistencies and help me clear them. 



====

- index.html
1. remove #learn-more button.
2. Start Validating Today reveal newletter subscription field, collects email and redirects to success.html.
3. Remove <!-- Email Signup Section -->
4. url to be /index.html 


- success.html
<!-- Upsell Section -->
1. upsell action redirect to -> https://calendly.com/toshioj/30min
2. comment out discord community. 
3. a id=accessDashboard point to -> sprint0-onboarding.html

- use sprint0-onboarding.html instead of sprint0-magnet-checklist.html. 
- refactor all /checklists to match ui and fucntionality of sprint0-onboarding.html

======

