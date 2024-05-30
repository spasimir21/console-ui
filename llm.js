import { LlamaModel, LlamaContext, LlamaChatSession, ChatMLChatPromptWrapper } from 'node-llama-cpp';
import promptFactory from 'prompt-sync';
import { fileURLToPath } from 'url';
import readline from 'readline';
import path from 'path';
import fs from 'fs';

let abortController = null;

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  if (abortController == null || key.name !== 'c') return;
  abortController.abort();
  abortController = null;
});

process.stdin.setRawMode(true);

const input = promptFactory({ sigint: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
  modelPath: path.join(__dirname, './llm.gguf'),
  useMlock: true,
  useMmap: true
});

const context = new LlamaContext({
  model,
  // contextSize: 32768,
  // batchSize: 512,
  // prependBos: true,
  threads: 4
});

let history = JSON.parse(fs.readFileSync('./history.json').toString());
let session = null;

function resetSession() {
  session = new LlamaChatSession({
    context,
    printLLamaSystemInfo: false,
    promptWrapper: new ChatMLChatPromptWrapper(),
    systemPrompt: fs.readFileSync('./system.txt').toString(),
    conversationHistory: [...history]
  });
}

resetSession();

async function prompt(question) {
  abortController = new AbortController();

  process.stdout.write('[STORY] ');

  let output = '';

  try {
    await session.prompt(question, {
      signal: abortController.signal,
      onToken: tokens => {
        const text = context.decode(tokens);
        output += text;

        process.stdout.write(text);
      }
      // temperature: 1.1
      // topK: 0,
      // topP: 1
      // grammar
    });
  } catch {}

  history.push({
    prompt: question,
    response: output
  });

  resetSession();

  process.stdout.write('\n');
}

async function main() {
  console.log('[INFO] Initializing LLM');

  await session.init();

  console.log('[INFO] Finished initializing LLM');

  if (history.length == 0) await prompt(fs.readFileSync('./prompt.txt').toString());

  while (true) {
    const question = input('[USER] ');

    if (question !== 'exit') {
      await prompt(question);
      continue;
    }

    fs.writeFileSync('./history.json', JSON.stringify(history, null, 2));
    fs.writeFileSync(
      './story.txt',
      history.map(({ prompt, response }) => `[USER] ${prompt}\n\n[STORY] ${response}\n`).join('\n')
    );

    break;
  }

  process.exit();
}

main();
