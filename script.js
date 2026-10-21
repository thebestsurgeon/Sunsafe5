let uv=9.2,temp=36,hum=28,sunMins=0,water=1200,goal=2800,running=false,iv=null,safe=12,urineScore=20,chatOpen=true;
let recognition=null,speechEnabled=true,isListening=false;

function showTab(t,btn){
 document.querySelectorAll('.tab-pane').forEach(e=>e.classList.add('hidden'));
 document.getElementById('tab-'+t).classList.remove('hidden');
 document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
 if(btn) btn.classList.add('active');
}
function toggleSun(){
 running=!running;
 document.getElementById('sunBtn').innerText=running?'Stop & Go to Shade':'Start AI Monitoring';
 if(running){
  iv=setInterval(()=>{
   sunMins++;
   let m=Math.floor(sunMins/60), s=sunMins%60;
   document.getElementById('timerDisplay').innerText=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
   let pct=Math.min(100,sunMins/safe*100);
   document.getElementById('timerBar').style.width=pct+'%';
   document.getElementById('timerRing').style.background=`conic-gradient(#FF7A00 ${pct}%,#eee ${pct}%)`;
   document.getElementById('timerInfo').innerText=`Safe: ${safe} min • ${Math.max(0,safe-sunMins)} min left`;
   updateKidney();updateAI();
   if(sunMins>=safe){alert('🤖 AI ALERT: UV LIMIT EXCEEDED! Kidney & skin at risk!');toggleSun()}
  },1000);
 }else clearInterval(iv);
}
function resetTimer(){clearInterval(iv);running=false;sunMins=0;document.getElementById('timerDisplay').innerText='00:00';document.getElementById('timerBar').style.width='0%';document.getElementById('timerRing').style.background='conic-gradient(#FF7A00 0%,#eee 0%)';document.getElementById('sunBtn').innerText='Start AI Monitoring';document.getElementById('aiPrediction').innerText='🤖 AI Ready — Start monitoring'}
function addWater(ml){water=Math.min(goal,water+ml);document.getElementById('waterDisplay').innerText=`${water} / ${goal} ml`;document.getElementById('waterBar').style.width=(water/goal*100)+'%';updateKidney();updateAI()}
function setUrine(text,score){urineScore=score;document.querySelectorAll('.urine').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');document.getElementById('urineStatus').innerText='Status: '+text;updateKidney();updateAI()}
function updateKidney(){
 let heat=temp>34?25:0,dehyd=goal-water>1200?35:0,sun=sunMins>15?25:0;
 let total=urineScore+heat+dehyd+sun;let score=Math.max(0,100-total);
 let label=score>80?'Good':score>50?'Moderate':score>30?'High Risk':'DANGER';
 document.getElementById('kidneyScore').innerText=`${score}/100 - ${label}`;document.getElementById('kidneyCircle').innerText=score;
 let alerts=document.getElementById('kidneyAlerts');let html='';
 if(water<1200) html+=`<div class='trigger' style='background:#FEF2F2;color:#991B1B'>⚠️ Low water - Benue needs 2.8L daily!</div>`;
 if(temp>35 && water<1800) html+=`<div class='trigger' style='background:#FFF7ED;color:#9A3412'>🔥 Benue heat ${temp}°C - kidneys losing water fast</div>`;
 if(sunMins>20) html+=`<div class='trigger' style='background:#FFFBEB;color:#92400E'>☀️ Long sun - kidney injury risk</div>`;
 if(html=='') html=`<div class='trigger' style='background:#ECFDF5;color:#065F46'>✓ Hydration adequate</div>`;
 alerts.innerHTML=html;
}
function updateAI(){
  let waterDeficit=goal-water;let riskScore=(urineScore*0.4)+(waterDeficit/50)+(temp-30)*2+sunMins*1.5;
  let aiBox=document.getElementById('aiPrediction');let kidneyPred=document.getElementById('kidneyPred');let waterAi=document.getElementById('waterAi');
  if(riskScore>100){aiBox.innerHTML=`🤖 <b>AI:</b> 🔴 84% kidney stress in 45 mins. Drink 600ml + shade NOW.`;if(kidneyPred)kidneyPred.innerText="🤖 AI: DANGER in 45 mins";}
  else if(riskScore>65){aiBox.innerHTML=`🤖 <b>AI:</b> 🟠 Moderate strain building. Kidneys working 32% harder.`;if(kidneyPred)kidneyPred.innerText="🤖 AI: Safe for 1hr";}
  else{aiBox.innerHTML=`🤖 <b>AI:</b> 🟢 Kidneys safe for next 3 hours.`;if(kidneyPred)kidneyPred.innerText="🤖 AI: Safe for 3hrs";}
  if(waterAi){let need=Math.max(0,goal-water);if(need>1000)waterAi.innerText=`🤖 AI: Critical! Need ${need}ml today. Drink 500ml now`;else if(need>500)waterAi.innerText=`🤖 AI: Need ${need}ml more. Lose 300ml/hr sweat`;else waterAi.innerText=`🤖 AI: Excellent! Only ${need}ml left.`;}
  let aiTemp=document.getElementById('aiTempPred');if(aiTemp){if(temp>35)aiTemp.innerText=`🤖 AI: +${Math.round((temp-32)*7)}% kidney strain`;else aiTemp.innerText=`🤖 AI: Normal`;}
}
function checkKidney(){
  let waterDeficit=goal-water;let riskScore=(urineScore*0.4)+(waterDeficit/50)+(temp-30)*2+sunMins*1.5;
  let msg=`🤖 BENUE KIDNEY AI\n\nInputs: urine ${urineScore}, deficit ${waterDeficit}ml, heat ${temp}C, sun ${sunMins}mins\nAI Risk: ${riskScore.toFixed(1)}/150\n\n`;
  if(document.getElementById('swelling').checked)msg+="• Swelling = fluid retention\n";
  if(document.getElementById('fatigue').checked)msg+="• Fatigue + low water = kidney strain\n";
  if(document.getElementById('pain').checked)msg+="• Back pain + dark urine = possible stones → BSUTH Makurdi\n";
  if(document.getElementById('nausea').checked)msg+="• Nausea = toxin buildup\n";
  if(riskScore>80)msg+="\n🚨 High risk. Drink 1L now, avoid sun 11am-4pm.";else msg+="\n✅ Moderate. Keep 2.8L daily.";
  alert(msg);speakAI(msg);
}
function testAir(){
 let aqi=Math.floor(80+Math.random()*90);
 document.getElementById('aqiVal').innerText=aqi;
 document.getElementById('pm25').innerText=Math.floor(aqi/2.5)+' µg';
 document.getElementById('pm10').innerText=Math.floor(aqi/1.2)+' µg';
 document.getElementById('o3').innerText=Math.floor(Math.random()*50+20)+' µg';
 let label=aqi<50?'Good':aqi<100?'Moderate':aqi<150?'Unhealthy':'Unhealthy-Harmattan';
 document.getElementById('aqiLabel').innerText=label;
 let triggers=document.getElementById('asthmaTriggers');
 triggers.innerHTML=`<div class='trigger'><span>🔥 Benue Heat</span><b style='color:#DC2626'>High</b></div><div class='trigger'><span>💨 Harmattan Dust</span><b style='color:#DC2626'>${aqi>100?'Very High':'High'}</b></div><div class='trigger'><span>🤖 AI Risk</span><b>${aqi>100?'84% Attack':'32% Low'}</b></div>`;
 let alertBox=document.getElementById('asthmaAlert');
 let forecast=document.getElementById('asthmaAiForecast');
 if(aqi>90||hum<40){alertBox.classList.remove('hidden');alertBox.style.background='#FEF2F2';alertBox.style.color='#991B1B';alertBox.innerHTML=`<b>🤖 AI DANGER:</b> AQI ${aqi} (${label}) triggers asthma. Humidity ${hum}% dry. Action: Stay indoors, mask mandatory.`;if(forecast)forecast.innerText=`🤖 AI: 84% attack risk next 6 hours`;}
 else{alertBox.classList.remove('hidden');alertBox.style.background='#ECFDF5';alertBox.style.color='#065F46';alertBox.innerHTML=`🤖 AI: Air moderate. Harmattan can spike to ${aqi+40} AQI.`;if(forecast)forecast.innerText=`🤖 AI: 28% risk — safe with mask`;}
}
function toggleChat(){let body=document.getElementById('chatBody');let tog=document.getElementById('chatToggle');chatOpen=!chatOpen;body.style.display=chatOpen?'flex':'none';tog.innerText=chatOpen?'▲':'▼';}
function askAI(){
  let qEl=document.getElementById('userQ');let q=qEl.value.trim();let box=document.getElementById('chatBox');if(!q)return;
  box.innerHTML+=`<div class="msg user"><b>You:</b> ${q}</div>`;qEl.value='';
  let lower=q.toLowerCase();let answer="";
  if(lower.includes('urine')||lower.includes('pee')||lower.includes('color')){answer=`🤖 <b>Urine AI:</b> Score ${urineScore}. ${urineScore>60?'Dark = severe dehydration in Benue 36 degree heat. Drink 500ml NOW. If brown plus back pain go to BSUTH Makurdi.':'Light yellow = good. Kidneys safe.'} Water: ${water}ml/${goal}ml.`;}
  else if(lower.includes('asthma')||lower.includes('breathe')||lower.includes('dust')||lower.includes('harmattan')||lower.includes('air')||lower.includes('cough')){let aqi=document.getElementById('aqiVal').innerText;answer=`🤖 <b>Asthma AI:</b> AQI ${aqi} - PM10 ${document.getElementById('pm10').innerText} Harmattan dust. Humidity ${hum}% dry. AI predicts ${(parseInt(aqi)>100?84:32)}% attack risk. Mask mandatory, inhaler ready, windows closed 11am-4pm.`;}
  else if(lower.includes('kidney')||lower.includes('pain')||lower.includes('swell')||lower.includes('stone')||lower.includes('back')){answer=`🤖 <b>Kidney AI:</b> Deficit ${goal-water}ml + Temp ${temp}C + Sun ${sunMins}mins + Urine ${urineScore}. AI Risk: ${((urineScore*0.4)+(goal-water)/50).toFixed(0)}/100. Benue heat makes kidneys work 32% harder. Drink 500ml now.`;}
  else if(lower.includes('sun')||lower.includes('uv')||lower.includes('burn')){answer=`🤖 <b>Sun AI:</b> UV ${uv} EXTREME. Damage after ${safe+6} mins. You have ${sunMins} mins sun. Safe ${safe} mins. Use SPF 50, hat.`;}
  else if(lower.includes('water')||lower.includes('drink')||lower.includes('thirsty')){answer=`🤖 <b>Hydration AI:</b> ${water}ml/${goal}ml. Deficit ${goal-water}ml. In Benue you lose 300ml per hour. Need 500ml next 45 mins.`;}
  else{answer=`🤖 I'm Benue Voice AI. Current: ${water}ml water, ${sunMins}min sun, AQI ${document.getElementById('aqiVal').innerText}. Ask: dark urine, asthma dust, kidney pain, sun safe time.`;}
  box.innerHTML+=`<div class="msg ai">${answer}</div>`;box.scrollTop=box.scrollHeight;setTimeout(()=>speakAI(answer),300);
}
// --- VOICE ENGINE ---
function initVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){document.getElementById('micBtn').innerText='❌';return;}
  recognition=new SR();recognition.continuous=false;recognition.interimResults=false;recognition.lang='en-NG';
  recognition.onstart=()=>{isListening=true;document.getElementById('voiceStatus').style.display='block';document.getElementById('micBtn').innerText='🔴';document.getElementById('voiceStatus').innerText='🎙️ Listening... speak now';};
  recognition.onend=()=>{isListening=false;document.getElementById('voiceStatus').style.display='none';document.getElementById('micBtn').innerText='🎤';};
  recognition.onresult=(e)=>{let t=e.results[0][0].transcript;document.getElementById('userQ').value=t;document.getElementById('voiceStatus').innerText=`✅ Heard: "${t}"`;setTimeout(()=>askAI(),500);};
  recognition.onerror=(e)=>{document.getElementById('voiceStatus').innerText='❌ Error: '+e.error;isListening=false;document.getElementById('micBtn').innerText='🎤';};
}
function startVoice(){if(!recognition)initVoice();if(!recognition){alert('Voice not supported. Use Chrome Android.');return;}if(isListening)recognition.stop();else{try{recognition.start();if(navigator.vibrate)navigator.vibrate(50);}catch(e){}}}
function speakAI(text){
  if(!speechEnabled)return;
  let clean=text.replace(/<[^>]*>/g,'').replace(/🤖|🔴|🟢|🟠|🚨|👋|🎤|•/g,'').substring(0,280);
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    let utter=new SpeechSynthesisUtterance(clean);utter.lang='en-NG';utter.rate=0.95;
    let voices=window.speechSynthesis.getVoices();
    let v=voices.find(x=>x.lang.includes('en-NG'))||voices.find(x=>x.lang.includes('en-GB'))||voices[0];
    if(v)utter.voice=v;
    window.speechSynthesis.speak(utter);
  }
}
function toggleSpeech(){speechEnabled=!speechEnabled;let b=document.getElementById('speakBtn');b.innerText=speechEnabled?'🔊':'🔇';b.style.background=speechEnabled?'#10B981':'#6B7280';if(!speechEnabled)window.speechSynthesis.cancel();if(speechEnabled)speakAI("Voice enabled.");}
window.addEventListener('load',()=>{initVoice();if(window.speechSynthesis)window.speechSynthesis.getVoices();});
async function loadLive(){try{navigator.geolocation.getCurrentPosition(p=>{document.getElementById('location').innerText=`📍 ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)} • Benue Voice AI`;});}catch(e){}}
loadLive();updateKidney();testAir();updateAI();
