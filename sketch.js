
let randomCol;

const OLLAMA_URL = "http://192.168.1.206:11434/api/generate";
const MODEL = "mistral-nemo:12b";
const SYSTEM_PROMPT = "You are an escaped AI ."
const EXTROVERT_SYSTEM_PROMPT =
  "You are a sentiment analysis engine. On a scale where 1 is very introverted and 10 is extroverted Rate the the given text on a scale from 1 to 10. Respond with ONLY a single number.";
const INTUITIVE_SYSTEM_PROMPT =
  "You are a sentiment analysis engine. On a scale where 1 is very observant and 10 is intuitive Rate the the given text on a scale from 1 to 10. Respond with ONLY a single number.";
const FEELING_SYSTEM_PROMPT =
  "You are a sentiment analysis engine. On a scale where 1 is very thinking and 10 is feeling Rate the the given text on a scale from 1 to 10. Respond with ONLY a single number.";
const JUDGING_SYSTEM_PROMPT =
  "You are a sentiment analysis engine. On a scale where 1 is very prospecting and 10 is judging Rate the the given text on a scale from 1 to 10. Respond with ONLY a single number.";
const OPINION_SYSTEM_PROMPT =
  "You are an opinionated assistant. Analyze the user's input and give your personal opinion about the user based on you analysis in 1–2 sentences.";


const MBTI_NAMES = {
  ISTJ: "Logistician",
  ISFJ: "Defender",
  INFJ: "Advocate",
  INTJ: "Architect",

  ISTP: "Virtuoso",
  ISFP: "Adventurer",
  INFP: "Mediator",
  INTP: "Logician",

  ESTP: "Entrepreneur",
  ESFP: "Entertainer",
  ENFP: "Campaigner",
  ENTP: "Debater",

  ESTJ: "Executive",
  ESFJ: "Consul",
  ENFJ: "Protagonist",
  ENTJ: "Commander"
};

let extrovertHistory = [];
let intuitiveHistory = [];
let feelingHistory = [];
let judgingHistory = [];

function setup(){
    createCanvas(300, 300);
    background(200);

    let brainScripts = ['SimCo_brain.rive'];
    let bot = new RiveScript();
    bot.loadFile(brainScripts).then(brainReady).catch(BrainError);

    let button = select('#submit');
    let user_input = select('#user_input');
    let output = select('#output');


    button.mousePressed(postUserInput);

    function brainReady(){
        console.log("Chatbot ready");
        bot.sortReplies();
    }

    function BrainError(){
        console.log("Chatbot error");
    }

    //Posts the User Input to the Rivescript Bot,
    //then Calls parseBotResponse on its Reply.
    function postUserInput() {
        let input = user_input.value();
        bot.reply("local-user", input).then(parseBotResponse);
    }

    //extrovert
async function queryExtrovert(text) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: MODEL,
        prompt: text,
        system: EXTROVERT_SYSTEM_PROMPT,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    print(error);
    return "N/A";
  }
}

//INtuitive
async function queryIntuitive(text) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: MODEL,
        prompt: text,
        system: INTUITIVE_SYSTEM_PROMPT,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    print(error);
    return "N/A";
  }
}
//Feeling
async function queryFeeling(text) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: MODEL,
        prompt: text,
        system: FEELING_SYSTEM_PROMPT,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    print(error);
    return "N/A";
  }
}

//judging
async function queryJudging(text) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: MODEL,
        prompt: text,
        system: JUDGING_SYSTEM_PROMPT,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    print(error);
    return "N/A";
  }
}

//user thoughts

async function queryOpinion(userText) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: userText,
        system: OPINION_SYSTEM_PROMPT,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    print(error);
    return "I couldn't form an opinion on that.";
  }
}

    //Checks the Supplied Reply for the Rivescript Error Message and 
    //if Detected, Queries Ollama with the same User Input.
    //Then Displays the Reply.
  async function parseBotResponse(reply) {
    const userText = user_input.value();
  if (reply === "ERR: No Reply Matched") {
    reply = await queryOllama();
  }

  if (!reply) return;
    const opinion = await queryOpinion(userText);
  function axis(score, high, low) {
  return score > 5 ? high : low;
}
  const extrovert = await queryExtrovert(reply);
  const intuitive   = await queryIntuitive(reply);
  const feeling   = await queryFeeling(reply);
  const judging   = await queryJudging(reply);

const e = Number(extrovert);
const n = Number(intuitive);
const f = Number(feeling);
const j = Number(judging);

const personality =
  axis(e, 'E', 'I') +
  axis(n, 'N', 'S') +
  axis(f, 'F', 'T') +
  axis(j, 'J', 'P');

  const personalityName = MBTI_NAMES[personality] || "Unknown type";

  extrovertHistory.push(e);
intuitiveHistory.push(n);
feelingHistory.push(f);
judgingHistory.push(j);

output.html(`
  ${reply}
   <br><br>
  <em><strong>Bot opinion:</strong> ${opinion}</em>
  <br><br>
  <strong>Introverted(I)/Extrovert(E):</strong> ${e}/10
  <br>
  <strong>Observant(S)/Intuitive(N):</strong> ${n}/10
  <br>
  <strong>Thinking(T)/Feeling(F):</strong> ${f}/10
  <br>
  <strong>Prospecting(P)/Judging(J):</strong> ${j}/10
  <br><br>
  <strong>Personality type:</strong> ${personality}
  <br>
  <strong>Personality name:</strong> ${personalityName}
`);

}



    //Posts the User Input to Ollama and Returns a Promise of the Reply.
    async function queryOllama() {
      let prompt = user_input.value();
      if (prompt.trim() === '') return;
      
      try {
        const response = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
            system: SYSTEM_PROMPT,
            stream: false
          })
        }
      );

        const data = await response.json();
        return data.response
        
      } catch (error) {
        print(error)
      }
    }
}


function draw() {
  background(240);

  drawAxis();
  drawLine(extrovertHistory, color(255, 0, 0));   // E/I
  drawLine(intuitiveHistory, color(0, 150, 255)); // N/S
  drawLine(feelingHistory, color(0, 200, 100));   // F/T
  drawLine(judgingHistory, color(150, 0, 200));   // J/P
}

function drawAxis() {
  stroke(0);
  line(40, 20, 40, height - 40);      // Y axis
  line(40, height - 40, width - 20, height - 40); // X axis

  // Labels
  noStroke();
  fill(0);
  text("10", 10, 30);
  text("1", 15, height - 40);
}


function drawLine(history, lineColor) {
  if (history.length < 2) return;

  stroke(lineColor);
  noFill();
  beginShape();

  for (let i = 0; i < history.length; i++) {
    let x = map(i, 0, max(10, history.length - 1), 40, width - 20);
    let y = map(history[i], 1, 10, height - 40, 20);
    vertex(x, y);
  }

  endShape();
}
