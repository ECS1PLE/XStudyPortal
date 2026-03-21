process.loadEnvFile();

const API_KEY = process.env.API_KEY;
const url = 'https://openrouter.ai/api/v1/chat/completions';
const prompt = require('prompt-sync')();

if (!API_KEY) {
  throw new Error('API_KEY не найден. Запусти файл через: node --env-file=.env model.js');
}

const content = prompt('Введите текст для ИИ: ');

const requestBody = {
  model: 'qwen/qwen3-vl-235b-a22b-thinking',
  messages: [
    {
      role: 'user',
      "content": [
        {
          type: "text",
          text: `${content}`
        }
      ]
    }
  ]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'My Test App'
  },
  body: JSON.stringify(requestBody)
})
  .then(res => res.json())
  .then(data => console.log("Ответ Модели: \n", data.choices[0].message.content))
  .catch(err => console.error(err))