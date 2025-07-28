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

done

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

done

====== 
(10PM)
finish current task, execute the tasks below then continue original plan

- add to all html pages <!-- Hotjar Tracking Code for https://overnightmvp.netlify.app/ -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6476354,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

all onboarding html pages
- comment out elements class step-actions 
- time remaining to display hh format
- move srpint navigation element to its own row at the bottom 

sprint0-onboarding.html

- missing sprint navigation element 

=====
- make it a global rule after commiting a change /compact to: 1. Summarize the conversation so far and retain only the key points/context needed for next steps.”, 2. update customer_journey_blueprint.md and follow other best practices to optimise token consumption and keep s-tier quality, be brutally honest when planning cutting unnecessary work and added complexity, keep things concise and efficient.
- analyse content files and organise the structure of this project, removing duplicates, gathering all non relevant files on a single folder and all maintain s-tier project organisation best practices. make questions for clarification. suggest best course of action based on consistency, simplicity and ease of customisation. im not looking for code refactoring, just project organisation an better urls.
- create a data-colection.md file explaining how we are using Ga4.
- map all documentation necessary to customise and repurpose this project. create setup guide.
- show all planned tasks 


====

- analyse customer_journey_blueprint.md and update strategic framework documentation
