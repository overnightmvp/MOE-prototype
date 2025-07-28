fixes

index.html
- after collecting email wrong redirect lhttp://127.0.0.1:5500/pages/success.html?email=sss%40sss.com&source=main_landing, returns Cannot GET /pages/success.html

success.html
- wrong redirect http://127.0.0.1:5500/onboarding/sprint0-onboarding.html?email= returns Cannot GET /onboarding/sprint0-onboarding.html, returns wrong redirect Cannot GET /onboarding/sprint0-onboarding.html

check routing for all onboarding