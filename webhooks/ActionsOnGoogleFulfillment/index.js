const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation();

var scenario1 = {
  "description": "Jim is an accountant. He has been tracking his mood for about 6 months and finds it very helpful as his job can sometimes be quite stressful.",
  "log": {
    "intro": "After work he logs his mood.",
    "mood": "okay",
    "water": "5 glasses",
    "sleep": "6 hours",
    "exercise": "Moderate, 30 mins",
  },
  "analysis": {
    "intro": "The mood logger notifies him that an analysis of his mood data has been completed. This is what he receives:",
    "data": ['When you sleep less than 8 hours you are more likely to track “okay”.', "You are more likely to be at least moderately active on days you track good moods.", "On Sunday you are less active than any other day of the week."],
  },
  "ending": "After receiving this information from the mood logger. Jim decides to have an early night to catch up on some sleep, hoping it will improve his mood for tomorrow."
};

var scenario2 = {
  "description": "Grace is a student. She is working a lot at the moment to prepare for exams. She started using the mood logger last month as she noticed that her mental health was declining and wanted to see if mood logging could help.",
  "log": {
    "intro": "After finishing her studying she logged her mood for the day.",
    "mood": "stressed",
    "water": "4 glasses",
    "sleep": "4 hours",
    "exercise": "10 mins",
  },
  "analysis": {
    "intro": "The mood logger notifies her that an analysis of her mood data has been completed. This is what she receives:",
    "data": ["You are more likely to have a poor mood when you get less than 8 hours sleep.", "You are more likely to have a good mood when you drink more than 6 glasses of water a day.", "You were less active this month than you were last month."]
  },
  "ending": "Grace realises that her poor sleep schedule and lack of activity might be hindering her ability to study well. She decides to increase her activity with daily walks as a study break, and to finish studying by 11pm so that she can get enough sleep."
};

var scenario3 = {
  "description": "Megan is a teacher. She tracks her mood regularly and finds the analysis/observations very helpful. She is currently trying to get at least 7 hours of sleep a night since last month the mood logger informed her that she is mostly tracking bad moods on days she is not getting enough sleep.",
  "log": {
    "intro": "After school she logs her mood:",
    "mood": "good",
    "water": "8 glasses",
    "sleep": "7 hours",
    "exercise": "Moderate, 30 mins",
  },
  "analysis": {
    "intro": "The mood logger notifies her that an analysis of her mood data has been completed. This is what she receives:",
    "data": ["You track good on most days where you get at least 7 hours of sleep.", "You are less likely to track bad moods when you are moderately active.", 'On Mondays you are most likely to track “okay”.']
  },
  "ending": "Megan finds this analysis very intriguing, showing that a decent night sleep has been benefitting her mood greatly and will continue to do so. She will also continue to keep up with her activity as that also seems to benefit her mood."
};

scenarios = [scenario1, scenario2, scenario3];

app.handle('getScenarioDescription', conv => {
  conv.session.params.index = getRandom();
  var thisScenario = scenarios[conv.session.params.index];
  
  conv.add(thisScenario.description);
});

app.handle('getScenarioLog', conv => {
  var s = scenarios[conv.session.params.index];
  
  conv.add(s.log.intro);
  conv.add("Mood Logged: " + s.log.mood + ".\nWater: " + s.log.water + ".\nSleep: " + s.log.sleep + ".\nExercise: " + s.log.exercise + ".\nPlease say continue to move on.");
});

app.handle('getScenarioAnalysis', conv => {
  var s = scenarios[conv.session.params.index];
      
  conv.add(s.analysis.intro);
  conv.add(s.analysis.data.join(" ") + "\nPlease say continue to move on.");
});

app.handle("getScenarioEnding", conv => {
  var s = scenarios[conv.session.params.index];
  
  conv.add(s.ending);
});

function getRandom(){
  // get random number between 1 and 3 inclusive to pic scenario
  min = Math.ceil(0);
  max = Math.floor(2);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
