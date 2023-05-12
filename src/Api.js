import axios from 'axios';

const tryLogin = (email, password) => new Promise((resolve, reject) => {
  axios.post('https://id.fw.uc.pt/v1/login', {email, password, longLivedToken: false})
  .then(response => { resolve(response.data.token) }).catch(error => { resolve('') });
});

const getPresence = (token, aula) => new Promise((resolve, reject) => {
  axios.get(`https://academic.fw.uc.pt/v1/student/class/${aula}/presence`, { headers: { 'authorization': token } })
  .then(response => {
    if (response.data.type == null) resolve(response.data.type);
    else resolve(true);
  }).catch(error => { resolve(true) });
});

const submitPresence = async (token, aula, session) => {
  const payload = { "type": "local" }
  try {
    const response = await axios.post(`https://academic.fw.uc.pt/v1/student/class/${aula}/session/${session}/presence`, payload, { headers: { 'authorization': token, 'Content-Type': 'application/json' } });
    return response.data;
  } catch (error) {
    return false;
  }
}

const getAula = (token) => new Promise((resolve, reject) => {
  axios.get('https://academic.fw.uc.pt/v1/student/sessions/next', { headers: { 'authorization': token } })
  .then(async response => {
    for (let i = 0; i < response.data.length; i++) {
      element = response.data[i];
      aula = element.edition.key;
      session = element.key;
      let start = new Date(element.start_date);
      let end = new Date(element.end_date);
      
      let now = Date.now();
      if ((now > start && now < end)) break;
      aula = null;
      session = null;
    }
    resolve({ aula, session });
  }).catch(error => { resolve({ aula: null, session: null}) });
});

export { tryLogin, getPresence, submitPresence, getAula };